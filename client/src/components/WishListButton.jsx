import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axiosInstance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const WishlistButton = ({ productId }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axiosInstance.get("/wishlist");
        const wishlist = res.data.items;
        const exists = wishlist.some((item) => item.product._id === productId);
        setInWishlist(exists);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setInWishlist(false);
        } else {
          console.error("Failed to fetch wishlist:", err);
        }
      }
    };
    fetchWishlist();
  }, [productId]);

  const toggleWishlist = async () => {
    setLoading(true);
    try {
      if (inWishlist) {
        await axiosInstance.delete(`/wishlist/${productId}`);
        setInWishlist(false);
        toast.success("Removed from wishlist"); // ✅ show toast
      } else {
        await axiosInstance.post("/wishlist", { productId });
        setInWishlist(true);
        toast.success("Added to wishlist"); // ✅ show toast
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
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
      aria-label="Add to wishlist"
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
