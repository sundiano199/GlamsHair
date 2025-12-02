// src/pages/WishListPage.jsx
import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import HairCard from "@/components/HairCard";
import toast from "react-hot-toast";
import normalizeProduct from "@/utils/normalizeProduct";

const WishListPage = () => {
  const { user, loading: authLoading, error } = useAuth();
  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState(true);
  // array of { originalEntry, product }
  const [items, setItems] = useState([]);

  const fetchWishlist = async () => {
    setPageLoading(true);
    try {
      const res = await axiosInstance.get("/wishlist");
      const data = res.data;
      let list = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
        ? data
        : [];

      const normalized = list.map((entry) => {
        const raw = entry?.product ?? entry;
        const product = normalizeProduct(raw);

        // Debug helper: surface missing app ids
        if (!product.id) {
          console.warn("Wishlist item missing app-level id:", raw);
        }

        return { originalEntry: entry, product };
      });

      setItems(normalized);
    } catch (err) {
      console.error("fetch wishlist error:", err);
      toast.error("Could not load wishlist");
      setItems([]);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      toast.dismiss();
      toast.error("Sign in to view your wishlist");
      navigate("/signin");
      return;
    }
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, navigate]);

  // Remove by app-level id (product.id). If backend expects mongo _id change server or adapt.
  const handleRemove = async (productId) => {
    if (!productId) return;
    const before = items;
    setItems((prev) =>
      prev.filter((it) => String(it.product.id) !== String(productId))
    );

    try {
      const res = await axiosInstance.delete(`/wishlist/${productId}`);
      if (res.data?.success) {
        toast.success("Removed from wishlist");
        await fetchWishlist();
      } else {
        toast.error(res.data?.message || "Could not remove from wishlist");
        setItems(before);
      }
    } catch (err) {
      console.error("remove wishlist error:", err);
      toast.error("Could not remove from wishlist");
      setItems(before);
      try {
        await fetchWishlist();
      } catch (e) {}
    }
  };

  const handleCardClick = (product) => {
    if (!product) return;
    if (product.id) {
      navigate(`/productdetail/${product.id}`);
    } else {
      // explicit: do not navigate with mongo _id. Instead show helpful message
      toast.error("Product missing app id — contact admin or refresh data.");
      console.warn(
        "Attempted to navigate using mongo _id; app-level id missing:",
        product
      );
    }
  };

  return (
    <div>
      <NavBar />
      <div className="border-t-4 border-gray-400  pt-5">
        <h1 className="text-center text-3xl">My WishList</h1>

        <div className=" mx-8 border-4 px-4 pt-4 pb-6 border-gray-300 shadow-2xl rounded-3xl my-4">
          {error && (
            <div className="text-center text-red-500 text-xl">{error}</div>
          )}

          {pageLoading ? (
            <div className="text-center text-xl">Loading wishlist...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <h2 className="text-3xl">Your wishlist is empty</h2>
              <p className="mt-2 text-lg">
                Add items you love and come back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {items.map(({ originalEntry, product }) => {
                const productId = product.id; // app-level id only
                return (
                  <div
                    key={String(productId || product._id)}
                    className="relative"
                  >
                    <HairCard product={product} onClick={handleCardClick} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(productId);
                      }}
                      className="absolute top-3 right-3 bg-white bg-opacity-90 px-3 py-1 rounded-full shadow-sm text-sm font-medium"
                      aria-label={`remove-${productId}`}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishListPage;
