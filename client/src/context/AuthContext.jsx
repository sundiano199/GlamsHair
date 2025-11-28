// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading user on init
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser().catch(() => {});
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/auth/getUser");
      const fetchedUser = res.data?.user ?? null;
      setUser(fetchedUser);
      return fetchedUser;
    } catch (err) {
      setUser(null);
      console.error(
        "fetchUser error:",
        err.response?.data || err.message || err
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const [authenticating, setAuthenticating] = useState(false);
  const navigate = useNavigate();

  // helper to read local cart
  const readLocalCart = () => {
    try {
      const raw = localStorage.getItem("glam_cart_v1");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed.items) ? parsed.items : [];
    } catch (e) {
      return [];
    }
  };

  // inside AuthContext (replace existing login)
  const login = async (email, password) => {
    setAuthenticating(true);
    try {
      // Use axiosConfig which should have withCredentials: true
      const res = await axiosInstance.post("/auth/login", { email, password });

      // If backend returns a user object right away, prefer it
      const maybeUser = res.data?.user ?? null;

      // If we didn't get a user from the login response, try fetchUser() with a retry
      let finalUser = maybeUser;
      if (!finalUser) {
        try {
          finalUser = await fetchUser();
        } catch (e) {
          // first attempt failed — wait briefly and retry once (fixes iOS cookie persistence race)
          await new Promise((r) => setTimeout(r, 250));
          try {
            finalUser = await fetchUser();
          } catch (e2) {
            finalUser = null;
          }
        }
      }

      // If we have a user, immediately set it in context
      if (finalUser) {
        setUser(finalUser);
      }

      // Merge guest local cart into server cart (non-blocking)
      (async () => {
        try {
          // attempt to read local cart created by CartContext
          const raw = localStorage.getItem("glam_cart_v1");
          const parsed = raw ? JSON.parse(raw) : null;
          const localItems = Array.isArray(parsed?.items) ? parsed.items : [];

          if (localItems && localItems.length > 0) {
            const payload = localItems.map((it) => ({
              productId: it.id || it.productId || it._id,
              name: it.title || it.name || "",
              price: it.price || 0,
              image:
                (Array.isArray(it.images) && it.images[0]) || it.image || "",
              quantity: Number(it.quantity) || 1,
            }));

            // send merge only if we successfully got a session user (server will reject otherwise)
            // we still attempt it — server-side will handle auth/validation
            await axiosInstance.post("/cart/merge", { items: payload });
          }
        } catch (mergeErr) {
          // non-fatal — log for debugging
          console.warn("Cart merge after login failed:", mergeErr);
        } finally {
          // trigger other parts of the app that listen for focus to reload cart
          try {
            window.dispatchEvent(new Event("focus"));
          } catch (e) {}
        }
      })();

      return { success: true, user: finalUser ?? null };
    } catch (err) {
      console.error("login error:", err?.response?.data ?? err?.message ?? err);
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed";
      return { success: false, error: String(backendMsg) };
    } finally {
      setAuthenticating(false);
    }
  };

  const signup = async (formData) => {
    setAuthenticating(true);
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      toast.success("Registration Successful", { id: "uufdgtr" });
      const createdUser = res.data?.user ?? null;
      if (createdUser) setUser(createdUser);
      else await fetchUser();

      // merge local cart on signup too (if any)
      try {
        const localItems = readLocalCart();
        if (localItems && localItems.length > 0) {
          const payload = localItems.map((it) => ({
            productId: it.id || it.productId || it._id,
            name: it.title || it.name || "",
            price: it.price || 0,
            image: (it.images && it.images[0]) || it.image || "",
            quantity: Number(it.quantity) || 1,
          }));
          await axiosInstance.post("/cart/merge", { items: payload });
        }
      } catch (err) {
        console.warn("Cart merge after signup failed:", err);
      }

      try {
        window.dispatchEvent(new Event("focus"));
      } catch (e) {}

      navigate("/");
      return { success: true };
    } catch (err) {
      console.error(err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.message || err.message,
      };
    } finally {
      setAuthenticating(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      try {
        window.dispatchEvent(new Event("focus"));
      } catch (e) {}
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signup,
        login,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
