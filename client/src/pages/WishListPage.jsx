// src/pages/WishListPage.jsx
import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import HairCard from "@/components/HairCard";
import toast from "react-hot-toast";

const WishListPage = () => {
  const { user, loading: authLoading, error } = useAuth();
  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState(true);
  const [items, setItems] = useState([]);

  // Helper: returns product id string from entry (works for populated/unpopulated shapes)
  const extractProductId = (entry) => {
    const p = entry?.product ?? entry;
    // try common fields
    return (
      (p?._id && String(p._id)) ||
      (p?.id && String(p.id)) ||
      (p?.productId && String(p.productId)) ||
      (typeof p === "string" ? p : null)
    );
  };

  // fetch wishlist for signed in user (always expects populated product in GET /wishlist)
  const fetchWishlist = async () => {
    setPageLoading(true);
    try {
      const res = await axiosInstance.get("/wishlist");
      const data = res.data;
      if (data?.success) {
        const list = Array.isArray(data.items) ? data.items : [];
        setItems(list);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("fetch wishlist error:", err);
      toast.error("Could not load wishlist");
      setItems([]);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    // wait until auth finishes initializing
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

  // remove handler: optimistic UI + re-fetch (ensures we get populated results)
  const handleRemove = async (productId) => {
    if (!productId) return;

    // optimistic removal
    const before = items;
    setItems((prev) =>
      prev.filter((entry) => {
        const id = extractProductId(entry);
        return String(id) !== String(productId);
      })
    );

    try {
      const res = await axiosInstance.delete(`/wishlist/${productId}`);
      if (res.data?.success) {
        toast.success("Removed from wishlist");
        // re-fetch the wishlist to ensure we have populated product docs
        await fetchWishlist();
      } else {
        toast.error(res.data?.message || "Could not remove from wishlist");
        setItems(before); // rollback
      }
    } catch (err) {
      console.error("remove wishlist error:", err);
      toast.error("Could not remove from wishlist");
      // rollback and re-sync from server
      setItems(before);
      try {
        await fetchWishlist();
      } catch (e) {
        // ignore
      }
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
              {items.map((entry) => {
                // backend shape: entry.product is populated product doc
                const product = entry.product || entry;
                const productId =
                  product._id || product.id || product.productId || product;
                return (
                  <div key={String(productId)} className="relative">
                    <HairCard product={product} productId={productId} />
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
