// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosConfig from "../utils/axiosConfig";
import toast from "react-hot-toast"; // optional: for notifications

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    subtotal: 0,
    loading: true,
    isSession: false,
  });

  // recalc totals
  const recalc = (items) => {
    const totalItems = items.reduce((sum, it) => sum + Number(it.quantity), 0);
    const subtotal = items.reduce(
      (sum, it) => sum + Number(it.quantity) * (Number(it.price) || 0),
      0
    );
    return { items, totalItems, subtotal };
  };

  // load cart from backend or use local
  const loadCart = async () => {
    setCart((c) => ({ ...c, loading: true }));
    try {
      const res = await axiosConfig.get("/cart"); // session backend
      setCart({
        ...recalc(res.data.items || []),
        loading: false,
        isSession: true,
      });
    } catch (err) {
      console.warn("Backend session not found, using local cart.");
      setCart((c) => ({
        ...recalc(c.items),
        loading: false,
        isSession: false,
      }));
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // add product to cart
  const addToCart = async (product, quantity = 1) => {
    const existing = cart.items.find(
      (it) => it.productId === product.productId
    );
    let newItems;

    if (existing) {
      newItems = cart.items.map((it) =>
        it.productId === product.productId
          ? { ...it, quantity: it.quantity + quantity }
          : it
      );
    } else {
      newItems = [...cart.items, { ...product, quantity }];
    }

    setCart((c) => ({ ...c, ...recalc(newItems) }));
    toast.success("Added to cart");

    if (cart.isSession) {
      try {
        await axiosConfig.post("/cart", {
          productId: product.productId,
          quantity,
          price: product.price,
          title: product.title,
          images: product.images,
          length: product.length,
        });
        await loadCart();
      } catch (err) {
        console.error("addToCart error:", err);
      }
    }
  };

  // update quantity
  const updateQty = async (productId, quantity) => {
    const newItems = cart.items.map((it) =>
      it.productId === productId ? { ...it, quantity } : it
    );
    setCart((c) => ({ ...c, ...recalc(newItems) }));

    if (cart.isSession) {
      try {
        await axiosConfig.put(`/cart/${productId}`, { quantity });
        await loadCart();
      } catch (err) {
        console.error("updateQty error:", err);
      }
    }
  };

  // remove item
  const removeFromCart = async (productId) => {
    const newItems = cart.items.filter((it) => it.productId !== productId);
    setCart((c) => ({ ...c, ...recalc(newItems) }));
    toast.success("Removed from cart");

    if (cart.isSession) {
      try {
        await axiosConfig.delete(`/cart/${productId}`);
        await loadCart();
      } catch (err) {
        console.error("removeFromCart error:", err);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, removeFromCart, loadCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
