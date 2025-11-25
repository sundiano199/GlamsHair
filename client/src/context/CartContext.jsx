// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import axiosConfig from "../utils/axiosConfig";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const LOCAL_KEY = "glam_cart_v1";

/* ---------- Helpers ---------- */

// Accepts product or cart item objects and returns a consistent string id.
// Tries several common fields so caller can send product/productId/_id etc.
const normalizeId = (obj) => {
  if (!obj) return undefined;
  // prefer explicit id (your product.json uses "id")
  if (typeof obj.id === "string" && obj.id.trim() !== "") return obj.id;
  // fallback to productId (some parts of your app use productId)
  if (typeof obj.productId === "string" && obj.productId.trim() !== "") return obj.productId;
  // fallback to Mongo _id
  if (typeof obj._id === "string" && obj._id.trim() !== "") return obj._id;
  // sometimes nested product object: { product: { id: "..."} }
  if (obj.product && typeof obj.product.id === "string") return obj.product.id;
  return undefined;
};

// Parse price strings into integer naira units (keeps your robust logic)
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
    // Ensure normalized id exists on stored items as `id`
    const id = normalizeId(it) || it.id || it.productId || it._id || String(Math.random());
    return { ...it, id, price, quantity };
  });
  const totalItems = normItems.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = normItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
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
      // ensure we persist normalized `id` on stored items
      const normalized = (items || []).map((it) => ({ ...it, id: normalizeId(it) || it.id }));
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ items: normalized }));
    } catch (err) {
      console.warn("Could not persist cart:", err);
    }
  };

  const loadCart = async () => {
    setCart((c) => ({ ...c, loading: true }));

    // 1) local snapshot first
    let localItems = [];
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        localItems = Array.isArray(parsed.items) ? parsed.items : [];
        const computed = recalc(localItems);
        setCart({ ...computed, loading: false, isSession: false });
      }
    } catch (err) {
      console.warn("Could not read local cart:", err);
    }

    // 2) try server
    try {
      const res = await axiosConfig.get("/cart"); // expects { items: [...] }
      const serverItems = Array.isArray(res.data?.items) ? res.data.items : [];

      const mergeLocalToServer = true;

      if (!serverItems || serverItems.length === 0) {
        if (mergeLocalToServer && localItems.length > 0) {
          try {
            await Promise.all(
              localItems.map((it) =>
                axiosConfig.post("/cart", {
                  // send productId to server using normalized id if available
                  productId: normalizeId(it) || it.productId || it.id,
                  title: it.title,
                  images: it.images,
                  length: it.length,
                  price: it.price,
                  quantity: it.quantity,
                })
              )
            );
            const reload = await axiosConfig.get("/cart");
            const reloaded = Array.isArray(reload.data?.items) ? reload.data.items : [];
            const computed = recalc(reloaded);
            setCart({ ...computed, loading: false, isSession: true });
            try {
              localStorage.setItem(LOCAL_KEY, JSON.stringify({ items: computed.items }));
            } catch (e) {}
            return;
          } catch (err) {
            console.warn("Could not merge local to server:", err);
            setCart((c) => ({ ...recalc(localItems), loading: false, isSession: false }));
            return;
          }
        } else {
          setCart((c) => ({ ...recalc(localItems), loading: false, isSession: false }));
          return;
        }
      } else {
        // server has items -> prefer server
        const computed = recalc(serverItems);
        setCart({ ...computed, loading: false, isSession: true });
        try {
          localStorage.setItem(LOCAL_KEY, JSON.stringify({ items: computed.items }));
        } catch (err) {}
        return;
      }
    } catch (err) {
      console.warn("Session cart load failed, keeping local cart. Err:", err);
      setCart((c) => ({ ...recalc(localItems), loading: false, isSession: false }));
      return;
    }
  };

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyLocalUpdate = (newItems, isSessionFlag = false) => {
    const computed = recalc(newItems);
    const updated = { ...computed, loading: false, isSession: !!isSessionFlag };
    setCart(updated);
    cartRef.current = updated;
    if (!isSessionFlag) persistLocal(computed.items);
  };

  /* ---------- Cart operations (use normalized id everywhere) ---------- */

  const addToCart = async (product, quantity = 1) => {
    const current = cartRef.current;
    const pid = normalizeId(product) || product.id || product.productId;
    const existing = current.items.find((it) => normalizeId(it) === pid || it.id === pid);

    let newItems;
    if (existing) {
      newItems = current.items.map((it) =>
        (normalizeId(it) === pid || it.id === pid)
          ? { ...it, quantity: Number(it.quantity || 0) + Number(quantity || 0) }
          : it
      );
    } else {
      const priceInt = coerceToIntegerNaira(product.price) || 0;
      newItems = [
        ...current.items,
        {
          id: pid,
          title: product.title,
          images: product.images,
          length: product.length,
          price: priceInt,
          quantity: Number(quantity) || 1,
        },
      ];
    }

    applyLocalUpdate(newItems, current.isSession);
    toast.success("Added to cart");

    if (current.isSession) {
      try {
        await axiosConfig.post("/cart", {
          productId: pid,
          title: product.title,
          images: product.images,
          length: product.length,
          price: coerceToIntegerNaira(product.price) || 0,
          quantity: Number(quantity) || 1,
        });
        await loadCart();
      } catch (err) {
        console.error("addToCart (server) error:", err);
        toast.error("Could not sync cart to session. Cart is saved locally.");
        applyLocalUpdate(newItems, false);
      }
    }
  };

  const updateQty = async (productId, quantity) => {
    const current = cartRef.current;
    // Accept productId passed as either normalized id or productId
    const pid = productId;
    const newItems = current.items.map((it) =>
      (normalizeId(it) === pid || it.id === pid) ? { ...it, quantity: Number(quantity) || 0 } : it
    );
    applyLocalUpdate(newItems, current.isSession);

    if (current.isSession) {
      try {
        await axiosConfig.put(`/cart/${pid}`, { quantity: Number(quantity) || 0 });
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
    const newItems = current.items.filter((it) => !(normalizeId(it) === pid || it.id === pid));
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
