import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axiosInstance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const WISHLIST_KEY = "guest_wishlist";

const WishlistButton = ({ productId }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in by fetching wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axiosInstance.get("/wishlist");
        if (res.data && Array.isArray(res.data.items)) {
          const exists = res.data.items.some(
            (item) => item.product?._id === productId
          );
          setInWishlist(exists);
          setIsGuest(false);
        } else {
          setInWishlist(false);
          setIsGuest(true);
        }
      } catch (err) {
        // If 401, treat as guest
        if (err.response?.status === 401) {
          setIsGuest(true);
          const guestWishlist = JSON.parse(
            localStorage.getItem(WISHLIST_KEY) || "[]"
          );
          setInWishlist(guestWishlist.includes(productId));
        } else {
          console.error("Failed to fetch wishlist:", err);
        }
      }
    };

    fetchWishlist();
  }, [productId]);

  // Toggle wishlist (handles both guest and logged-in)
  const toggleWishlist = async () => {
    setLoading(true);
    try {
      if (isGuest) {
        // Update localStorage for guests
        let guestWishlist = JSON.parse(
          localStorage.getItem(WISHLIST_KEY) || "[]"
        );
        if (inWishlist) {
          guestWishlist = guestWishlist.filter((id) => id !== productId);
          setInWishlist(false);
          toast.success("Removed from wishlist");
        } else {
          guestWishlist.push(productId);
          setInWishlist(true);
          toast.success("Added to wishlist");
        }
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(guestWishlist));
      } else {
        // Logged-in users
        if (inWishlist) {
          await axiosInstance.delete(`/wishlist/${productId}`);
          setInWishlist(false);
          toast.success("Removed from wishlist");
        } else {
          await axiosInstance.post("/wishlist", { productId });
          setInWishlist(true);
          toast.success("Added to wishlist");
        }
      }
    } catch (err) {
      if (err.response?.status === 401) {
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
