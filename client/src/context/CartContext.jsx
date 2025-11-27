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

// normalizeId: accepts product object or a raw id string
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
    return { ...it, id, price, quantity };
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

  // persist normalized items to localStorage
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

  // applyLocalUpdate: updates state, updates ref, and persists to localStorage (always)
  const applyLocalUpdate = (newItems, isSessionFlag = false) => {
    const computed = recalc(newItems);
    const updated = { ...computed, loading: false, isSession: !!isSessionFlag };
    setCart(updated);
    cartRef.current = updated;
    // persist always so cart survives refreshes regardless of session
    persistLocal(computed.items);
  };

  // read local storage raw items
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

  /* ---------- Server sync helpers ---------- */

  // mergeLocalToServer: calls /cart/merge and persists the merged server result locally
  const mergeLocalToServer = async (localItems) => {
    if (!Array.isArray(localItems) || localItems.length === 0) return null;
    try {
      const payloadItems = localItems.map((it) => ({
        productId: normalizeId(it) || it.productId || it.id,
        name: it.title || it.name || "",
        price: it.price || 0,
        image: (it.images && it.images[0]) || it.image || "",
        quantity: Number(it.quantity) || 1,
      }));
      const res = await axiosConfig.post("/cart/merge", {
        items: payloadItems,
      });
      const merged = Array.isArray(res.data?.items) ? res.data.items : [];
      const computed = recalc(merged);

      // persist the merged server-side cart into localStorage so we don't re-merge
      persistLocal(computed.items);
      setCart({ ...computed, loading: false, isSession: true });
      cartRef.current = { ...computed, loading: false, isSession: true };

      return computed.items;
    } catch (err) {
      console.warn("mergeLocalToServer failed:", err);
      return null;
    }
  };

  // refreshFromServer: idempotent pull of server cart (no merge)
  const refreshFromServer = async () => {
    try {
      const res = await axiosConfig.get("/cart");
      const serverItems = Array.isArray(res.data?.items) ? res.data.items : [];
      const computed = recalc(serverItems);
      setCart({ ...computed, loading: false, isSession: true });
      cartRef.current = { ...computed, loading: false, isSession: true };
      persistLocal(computed.items);
      return computed.items;
    } catch (err) {
      console.warn("refreshFromServer failed:", err);
      return null;
    }
  };

  /* ---------- loadCart (initial & fallback) ---------- */

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

    try {
      const res = await axiosConfig.get("/cart"); // expects { items: [...] }
      const serverItems = Array.isArray(res.data?.items) ? res.data.items : [];

      if (serverItems.length > 0) {
        // if both server and local exist, prefer merging via server
        if (localItems.length > 0) {
          const merged = await mergeLocalToServer(localItems);
          if (merged) return;
        }
        // take server copy
        const computed = recalc(serverItems);
        setCart({ ...computed, loading: false, isSession: true });
        persistLocal(computed.items);
        return;
      } else {
        // server empty
        if (localItems.length > 0) {
          // attempt to push local items to server as best-effort
          try {
            await Promise.all(
              localItems.map((it) =>
                axiosConfig.post("/cart", {
                  productId: normalizeId(it) || it.productId || it.id,
                  title: it.title || it.name,
                  images: it.images || (it.image ? [it.image] : []),
                  length: it.length,
                  price: it.price,
                  quantity: it.quantity,
                })
              )
            );
            // pull server now (may contain session-backed guest cart)
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
          applyLocalUpdate([], false);
          return;
        }
      }
    } catch (err) {
      console.warn("Session cart load failed, keeping local cart. Err:", err);
      applyLocalUpdate(localItems, false);
      return;
    }
  };

  // init on mount
  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- focus/visibility sync (debounced) ---------- */

  // use ref for last sync time to keep it stable across re-renders
  const lastSyncAtRef = useRef(0);
  const SYNC_COOLDOWN_MS = 1500;

  useEffect(() => {
    const runLoad = () => {
      const now = Date.now();
      if (now - lastSyncAtRef.current < SYNC_COOLDOWN_MS) return;
      lastSyncAtRef.current = now;
      if (!cartRef.current.loading) {
        loadCart().catch(() => {});
      }
    };

    const visibilityHandler = () => {
      if (document.visibilityState === "visible") runLoad();
    };

    window.addEventListener("focus", runLoad);
    document.addEventListener("visibilitychange", visibilityHandler);

    return () => {
      window.removeEventListener("focus", runLoad);
      document.removeEventListener("visibilitychange", visibilityHandler);
    };
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

    // try to sync to server if session
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
        // refresh authoritative server state (idempotent)
        await refreshFromServer();
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
        await refreshFromServer();
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
        await refreshFromServer();
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
        await refreshFromServer();
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
