// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosConfig";
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
      const res = await axios.get("/auth/getUser");
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

  const login = async (email, password) => {
    try {
      const res = await axiosConfig.post("/auth/login", { email, password });

      if (!res.data || res.data.success === false) {
        return { success: false, error: res.data?.message || "Login failed" };
      }

      // Extract user returned by backend
      const returnedUser = res.data.user || null;

      // Immediately set user in global context (important!)
      if (returnedUser) {
        setUser(returnedUser);
      }

      return {
        success: true,
        user: returnedUser,
        message: res.data.message || "Login successful",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Login failed",
      };
    }
  };

  const signup = async (formData) => {
    setAuthenticating(true);
    try {
      const res = await axios.post("/auth/signup", formData);
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
          await axios.post("/cart/merge", { items: payload });
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
      await axios.post("/auth/logout");
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
