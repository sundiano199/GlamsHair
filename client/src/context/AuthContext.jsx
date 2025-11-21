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
    fetchUser();
  }, []);

  // Fetch logged-in user from backend
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/auth/getUser"); // backend endpoint
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };
  const [authenticating, setAuthenticating] = useState(false);
  const navigate = useNavigate();
  // Signup function
  const signup = async (formData) => {
    setAuthenticating(true);
    try {
      const res = await axios.post("/auth/signup", formData);
      toast.success("Registration Successful", { id: "uufdgtr" });
      setUser(res.data); // automatically log in
      navigate("/");
      return { success: true };
    } catch (err) {
      console.error(err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.message || err.message,
      };
    } finally {
      // Resets the authenticating state to false once the request is complete
      setAuthenticating(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setAuthenticating(true);
    try {
      const res = await axios.post("/auth/login", { email, password });
      toast.success("Welcome Back", { id: "hcgmg" });
      await fetchUser(); // update user after login
      navigate("/");
      return { success: true };
    } catch (err) {
      console.error(err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.message || err.message,
      };
    } finally {
      // Resets the authenticating state to false once the request is complete
      setAuthenticating(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);
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
