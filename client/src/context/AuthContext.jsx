import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosConfig"; // your axiosConfig.js file
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading user on init
  const [error, setError] = useState(null);

  // Fetch current user on mount
  useEffect(() => {
    fetchUser().catch(() => {});
  }, []);

  // Fetch logged-in user from backend and return it
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/auth/getUser"); // backend endpoint
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

  const login = async (email, password) => {
    setAuthenticating(true);
    try {
      const res = await axios.post("/auth/login", { email, password });

      // If the login endpoint returns the user directly, prefer that
      const maybeUser = res.data?.user ?? null;

      // If login response doesn't include user, fetch it
      const finalUser = maybeUser ?? (await fetchUser());

      if (finalUser) setUser(finalUser);

      // Tell other parts of the app (CartContext) to re-sync now.
      // CartContext listens for "focus" and will call loadCart().
      try {
        window.dispatchEvent(new Event("focus"));
      } catch (e) {
        /* graceful fallback - no-op */
      }

      // IMPORTANT: do not navigate here — leave navigation to the caller (SignIn)
      return { success: true, user: finalUser };
    } catch (err) {
      console.error("login error:", err.response?.data || err.message || err);
      return {
        success: false,
        error: err.response?.data?.message || err.message || "Login failed",
      };
    } finally {
      setAuthenticating(false);
    }
  };

  // Signup function
  const signup = async (formData) => {
    setAuthenticating(true);
    try {
      const res = await axios.post("/auth/signup", formData);
      toast.success("Registration Successful", { id: "uufdgtr" });

      // If API returns created user object use it, else fetch
      const createdUser = res.data?.user ?? null;
      if (createdUser) setUser(createdUser);
      else await fetchUser();

      // trigger cart re-sync same as login
      try {
        window.dispatchEvent(new Event("focus"));
      } catch (e) {}

      navigate("/"); // you were navigating here already
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

  // Logout function
  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);

      // trigger cart re-sync so CartContext will detect logged-out state and keep local cart
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

// Custom hook for convenience
export const useAuth = () => useContext(AuthContext);
