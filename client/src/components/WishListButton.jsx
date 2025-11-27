import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axiosInstance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const WISHLIST_KEY = "guest_wishlist"; // kept but we no longer write to it for guests

const WishlistButton = ({ productId }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  // Check if user is logged in by fetching wishlist
  useEffect(() => {
    let mounted = true;
    const fetchWishlist = async () => {
      try {
        await fetchUser();
        const res = await axiosInstance.get("/wishlist");
        if (!mounted) return;
        if (res.data && Array.isArray(res.data.items)) {
          const exists = res.data.items.some(
            (item) =>
              (item.product?._id || item.productId || item.id) === productId
          );
          setInWishlist(exists);
          setIsGuest(false);
        } else {
          setInWishlist(false);
          setIsGuest(true);
        }
      } catch (err) {
        if (!mounted) return;
        // If 401, treat as guest
        if (err.response?.status === 401) {
          setIsGuest(true);
          // still check local storage so the UI shows current state, but we will block changes
          try {
            const guestWishlist = JSON.parse(
              localStorage.getItem(WISHLIST_KEY) || "[]"
            );
            setInWishlist(guestWishlist.includes(productId));
          } catch (e) {
            setInWishlist(false);
          }
        } else {
          console.error("Failed to fetch wishlist:", err);
        }
      }
    };

    fetchWishlist();
    return () => {
      mounted = false;
    };
  }, [productId]);

  // Toggle wishlist (handles both guest and logged-in) — modified so guests are blocked
  const toggleWishlist = async () => {
    // block immediate toggles when loading
    if (loading) return;
    // If guest, show toast and redirect to signin — do NOT modify localStorage
    if (isGuest) {
      toast((t) => (
        <span>
          Please sign in to add item to wishlist.{" "}
          <button
            onClick={() => {
              toast.dismiss(t.id);
              navigate(
                "/signin?redirect=" +
                  encodeURIComponent(window.location.pathname)
              );
            }}
            className="ml-2 underline"
          ></button>
        </span>
      ));
      // also navigate automatically after showing toast (small delay for UX)
      setTimeout(() => {
        navigate(
          "/signin?redirect=" + encodeURIComponent(window.location.pathname)
        );
      }, 300);
      return;
    }

    setLoading(true);
    try {
      if (inWishlist) {
        await axiosInstance.delete(`/wishlist/${productId}`);
        setInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await axiosInstance.post("/wishlist", { productId });
        setInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        // If we somehow get 401 even though we thought user was signed in, force redirect
        toast.error("Please sign in to use the wishlist");
        navigate(
          "/signin?redirect=" + encodeURIComponent(window.location.pathname)
        );
      } else {
        console.error("Wishlist toggle error:", err);
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {inWishlist ? (
        <FaHeart size={40} color="red" />
      ) : (
        <FaRegHeart size={40} />
      )}
    </button>
  );
};

export default WishlistButton;
