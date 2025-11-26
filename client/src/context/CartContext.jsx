// src/context/CartContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import axiosConfig from "../utils/axiosConfig";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const LOCAL_KEY = "glam_cart_v1";

/* ---------- Helpers ---------- */
const normalizeId = (obj) => {
  if (!obj) return undefined;
  if (typeof obj === "string") return obj;
  if (typeof obj.id === "string" && obj.id.trim() !== "") return obj.id;
  if (typeof obj.productId === "string" && obj.productId.trim() !== "")
    return obj.productId;
  if (typeof obj._id === "string" && obj._id.trim() !== "") return obj._id;
  if (obj.product && typeof obj.product.id === "string") return obj.product.id;
  return undefined;
};

const coerceToIntegerNaira = (v) => {
  if (v === null || v === undefined) return NaN;
  if (typeof v === "number") return Number.isFinite(v) ? Math.round(v) : NaN;
  let s = String(v).trim();
  s = s.replace(/[^\d.,-]/g, "");
  s = s.replace(/,/g, "");
  const parts = s.split(".");
  if (parts.length > 1) {
    const allGroupsAfterFirstAre3 = parts.slice(1).every((g) => g.length === 3);
    if (allGroupsAfterFirstAre3) s = parts.join("");
    else if (parts.length === 2 && parts[1].length === 3) s = parts.join("");
    else s = parts.join(".");
  }
  const n = parseFloat(s);
  return Number.isFinite(n) ? Math.round(n) : NaN;
};

const recalc = (items) => {
  const normItems = (items || []).map((it) => {
    const price = coerceToIntegerNaira(it.price) || 0;
    const quantity = Number(it.quantity) || 0;
    const id =
      normalizeId(it) ||
      it.id ||
      it.productId ||
      it._id ||
      String(Math.random());
    // ensure we return name/title consistency
    return {
      ...it,
      id,
      price,
      quantity,
      title: it.title || it.name || it.title || "",
    };
  });
  const totalItems = normItems.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = normItems.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0
  );
  return { items: normItems, totalItems, subtotal };
};

/* ---------- Provider ---------- */

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    subtotal: 0,
    loading: true,
    isSession: false,
  });

  const cartRef = useRef(cart);
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  const persistLocal = (items) => {
    try {
      const normalized = (items || []).map((it) => ({
        ...it,
        id: normalizeId(it) || it.id,
      }));
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ items: normalized }));
    } catch (err) {
      console.warn("Could not persist cart:", err);
    }
  };

  const applyLocalUpdate = (newItems, isSessionFlag = false) => {
    const computed = recalc(newItems);
    const updated = { ...computed, loading: false, isSession: !!isSessionFlag };
    setCart(updated);
    cartRef.current = updated;
    persistLocal(computed.items);
  };

  // Helper: read local items array from storage (raw)
  const readLocal = () => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed.items) ? parsed.items : [];
    } catch (err) {
      console.warn("readLocal failed:", err);
      return [];
    }
  };

  // Merge local guest items to server (protected endpoint expects user)
  const mergeLocalToServer = async (localItems) => {
    if (!Array.isArray(localItems) || localItems.length === 0) return null;
    try {
      // Make sure payload shape matches server expectation (productId, name, price, image, quantity)
      const payloadItems = localItems.map((it) => ({
        productId: normalizeId(it) || it.productId || it.id,
        name: it.title || it.name || "",
        price: it.price || it.price || 0,
        image: (it.images && it.images[0]) || it.image || "",
        quantity: Number(it.quantity) || 1,
      }));
      const res = await axiosConfig.post("/cart/merge", {
        items: payloadItems,
      });
      const merged = Array.isArray(res.data?.items) ? res.data.items : [];
      const computed = recalc(merged);
      setCart({ ...computed, loading: false, isSession: true });
      persistLocal(computed.items);
      return computed.items;
    } catch (err) {
      console.warn("mergeLocalToServer failed:", err);
      return null;
    }
  };

  // loadCart: load from local first, then attempt server sync/merge
  const loadCart = async () => {
    setCart((c) => ({ ...c, loading: true }));
    let localItems = readLocal();
    // show local immediately for snappy UX (if any)
    try {
      const computedLocal = recalc(localItems);
      setCart({ ...computedLocal, loading: false, isSession: false });
    } catch (e) {
      // ignore
    }

    // Try server — if user is logged in, server should return their cart items
    try {
      const res = await axiosConfig.get("/cart"); // expects { items: [...] }
      const serverItems = Array.isArray(res.data?.items) ? res.data.items : [];

      // If server reports user session (server-side will return user cart for logged-in requests)
      // We need to detect if user is signed-in. The server doesn't tell us directly here,
      // but serverItems being present does not necessarily mean authenticated (session-based).
      // We'll assume that if serverItems exist and request returned successfully, treat as session cart.
      // BUT only merge if we have a logged-in user (server-protected /merge will require auth).
      // We'll attempt merge if serverItems length > 0 and localItems length > 0:
      if (serverItems.length > 0) {
        // If both server and local exist, prefer merging server+local via server's /merge (server will sum quantities)
        if (localItems.length > 0) {
          // try to call /cart/merge to combine local guest items into server cart
          const merged = await mergeLocalToServer(localItems);
          if (merged) return; // mergeLocalToServer sets cart & persisted local
        }
        // no local items - take server copy
        const computed = recalc(serverItems);
        setCart({ ...computed, loading: false, isSession: true });
        persistLocal(computed.items);
        return;
      } else {
        // server empty
        if (localItems.length > 0) {
          // attempt to push local items to server (this will create a server cart in session or user cart if signed in)
          // prefer using /cart/merge if user is signed in — try merge first
          const merged = await mergeLocalToServer(localItems);
          if (merged) return;
          // if merge failed (possibly because not authenticated), fallback to posting each item to /cart so
          // server session (guest) might pick them up (depends on cookies). We'll do best-effort.
          try {
            await Promise.all(
              localItems.map((it) =>
                axiosConfig.post("/cart", {
                  productId: normalizeId(it) || it.productId || it.id,
                  title: it.title || it.name,
                  images: it.images || it.image ? [it.images || it.image] : [],
                  length: it.length,
                  price: it.price,
                  quantity: it.quantity,
                })
              )
            );
            const reload = await axiosConfig.get("/cart");
            const reloaded = Array.isArray(reload.data?.items)
              ? reload.data.items
              : [];
            const computed = recalc(reloaded.length ? reloaded : localItems);
            setCart({ ...computed, loading: false, isSession: false });
            persistLocal(computed.items);
            return;
          } catch (err) {
            // network or not authenticated - keep local only
            applyLocalUpdate(localItems, false);
            return;
          }
        } else {
          // nothing local and nothing server - show empty cart
          applyLocalUpdate([], false);
          return;
        }
      }
    } catch (err) {
      console.warn("Session cart load failed, keeping local cart. Err:", err);
      // network/no session — keep local cart
      applyLocalUpdate(localItems, false);
      return;
    }
  };

  // init on mount
  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep tabs/windows in sync via storage
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== LOCAL_KEY) return;
      try {
        const parsed = JSON.parse(e.newValue || "{}");
        const items = Array.isArray(parsed.items) ? parsed.items : [];
        const currentSerialized = JSON.stringify(cartRef.current.items || []);
        const newSerialized = JSON.stringify(items || []);
        if (currentSerialized !== newSerialized) {
          applyLocalUpdate(items, false);
        }
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // re-sync cart when tab becomes visible or window regains focus
  useEffect(() => {
    const runLoad = () => {
      if (!cartRef.current.loading) {
        loadCart().catch(() => {});
      }
    };

    window.addEventListener("focus", runLoad);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") runLoad();
    });

    return () => {
      window.removeEventListener("focus", runLoad);
      document.removeEventListener("visibilitychange", runLoad);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Cart operations (use normalized id everywhere) ---------- */

  const addToCart = async (productOrId, quantity = 1) => {
    const current = cartRef.current;
    const pid =
      normalizeId(productOrId) ||
      (typeof productOrId === "string" ? productOrId : undefined);
    const productObj =
      typeof productOrId === "string" ? { id: productOrId } : productOrId || {};
    const existing = current.items.find(
      (it) => normalizeId(it) === pid || it.id === pid
    );

    let newItems;
    if (existing) {
      newItems = current.items.map((it) =>
        normalizeId(it) === pid || it.id === pid
          ? {
              ...it,
              quantity: Number(it.quantity || 0) + Number(quantity || 0),
            }
          : it
      );
    } else {
      const priceInt = coerceToIntegerNaira(productObj.price) || 0;
      newItems = [
        ...current.items,
        {
          id: pid,
          title: productObj.title,
          images: productObj.images,
          length: productObj.length,
          price: priceInt,
          quantity: Number(quantity) || 1,
        },
      ];
    }

    // update locally first and persist
    applyLocalUpdate(newItems, current.isSession);
    toast.success("Added to cart");

    // try to sync to server if session (server-authoritative)
    if (current.isSession) {
      try {
        await axiosConfig.post("/cart", {
          productId: pid,
          title: productObj.title,
          images: productObj.images,
          length: productObj.length,
          price: coerceToIntegerNaira(productObj.price) || 0,
          quantity: Number(quantity) || 1,
        });
        await loadCart(); // refresh from server
      } catch (err) {
        console.error("addToCart (server) error:", err);
        toast.error("Could not sync cart to session. Cart is saved locally.");
        applyLocalUpdate(newItems, false);
      }
    }
  };

  const updateQty = async (productId, quantity) => {
    const current = cartRef.current;
    const pid = productId;
    const newItems = current.items.map((it) =>
      normalizeId(it) === pid || it.id === pid
        ? { ...it, quantity: Number(quantity) || 0 }
        : it
    );
    applyLocalUpdate(newItems, current.isSession);

    if (current.isSession) {
      try {
        await axiosConfig.put(`/cart/${pid}`, {
          quantity: Number(quantity) || 0,
        });
        await loadCart();
      } catch (err) {
        console.error("updateQty (server) error:", err);
        toast.error("Could not update cart on server. Changes saved locally.");
        applyLocalUpdate(newItems, false);
      }
    }
  };

  const removeFromCart = async (productId) => {
    const current = cartRef.current;
    const pid = productId;
    const newItems = current.items.filter(
      (it) => !(normalizeId(it) === pid || it.id === pid)
    );
    applyLocalUpdate(newItems, current.isSession);
    toast.success("Removed from cart");

    if (current.isSession) {
      try {
        await axiosConfig.delete(`/cart/${pid}`);
        await loadCart();
      } catch (err) {
        console.error("removeFromCart (server) error:", err);
        toast.error("Could not remove item from server cart. Removed locally.");
        applyLocalUpdate(newItems, false);
      }
    }
  };

  const clearCart = async () => {
    const current = cartRef.current;
    applyLocalUpdate([], false);
    try {
      if (current.isSession) {
        await axiosConfig.delete("/cart");
        await loadCart();
      }
      toast.success("Cart cleared");
    } catch (err) {
      console.error("clearCart error:", err);
      toast.error("Could not clear cart on server.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        loadCart,
        clearCart,
        mergeLocalToServer, // exported so AuthContext can call on login/signup
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
