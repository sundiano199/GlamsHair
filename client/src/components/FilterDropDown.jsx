import React, { useEffect, useState, useRef } from "react";
import HairCard from "./HairCard";
import axiosInstance from "../utils/axiosConfig";

const PAGE_SIZE = 10;

const FilterDropDown = () => {
  const [selected, setSelected] = useState("all");
  const [products, setProducts] = useState([]); // accumulated products shown
  const [allFetchedProducts, setAllFetchedProducts] = useState(null); // full list if backend returns all
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  // track lastRequestedCategory to avoid race conditions
  const lastRequested = useRef({ category: null, page: 1 });

  // core fetch: attempts to request paginated data from backend.
  // If backend returns full list instead, we fallback to client-side slicing.
  const fetchProducts = async (category, nextPage = 1, append = false) => {
    setError(null);
    // when loading first page
    if (!append) setLoading(true);
    else setLoadingMore(true);

    const requestId = `${category}::${nextPage}`;
    lastRequested.current = { category, page: nextPage };

    try {
      // Ask backend for paginated data. Many APIs accept `page` & `limit`.
      const res = await axiosInstance.get("/products", {
        params: {
          category: category === "all" ? undefined : category,
          page: nextPage,
          limit: PAGE_SIZE,
        },
      });

      // If backend returns an object with pagination metadata, use it
      const data = res.data;
      // Common shapes:
      // 1) { products: [...], total, page, limit }
      // 2) { products: [...] } (could be all or page)
      // 3) [...array...] (rare)
      let returnedProducts = [];
      let total = undefined;
      let returnedCount = 0;

      if (Array.isArray(data)) {
        // backend returned array directly -> assume it's the full list
        returnedProducts = data;
        total = data.length;
      } else if (Array.isArray(data.products)) {
        returnedProducts = data.products;
        // try to read total if provided by API
        if (typeof data.total === "number") total = data.total;
      } else {
        // unexpected shape
        returnedProducts = [];
      }

      returnedCount = returnedProducts.length;

      // If backend provided what looks like a full list (returnedCount <= PAGE_SIZE but no pagination metadata),
      // we will treat it as a full dataset and paginate client-side.
      const seemsToBeFullList =
        !data.page &&
        !data.limit &&
        typeof data.total === "undefined" &&
        (returnedProducts.length > PAGE_SIZE || page === 1);

      if (seemsToBeFullList) {
        // persist full list and slice for display
        setAllFetchedProducts(returnedProducts);
        const slice = returnedProducts.slice(0, PAGE_SIZE * nextPage);
        setProducts(slice);
        setHasMore(returnedProducts.length > slice.length);
      } else if (typeof total === "number") {
        // backend gave total count (good pagination support)
        if (append) {
          setProducts((prev) => [...prev, ...returnedProducts]);
        } else {
          setProducts(returnedProducts);
        }
        const accumulated =
          (append ? products.length + returnedCount : returnedCount) || 0;
        setHasMore(accumulated < total);
      } else {
        // fallback: backend returned a page or subset (no total) — use returned count to infer more
        if (append) setProducts((prev) => [...prev, ...returnedProducts]);
        else setProducts(returnedProducts);

        // if returned less than PAGE_SIZE, probably no more
        if (returnedCount < PAGE_SIZE) setHasMore(false);
        else setHasMore(true);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to fetch products"
      );
      setProducts([]);
      setAllFetchedProducts(null);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load / category change: reset and fetch page 1
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setAllFetchedProducts(null);
    setHasMore(false);
    fetchProducts(selected, 1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // Handler for "Load more" button
  const handleLoadMore = async () => {
    // If we previously fetched a full list into allFetchedProducts, just slice locally
    if (allFetchedProducts) {
      const nextPage = page + 1;
      const nextSlice = allFetchedProducts.slice(0, PAGE_SIZE * nextPage);
      setProducts(nextSlice);
      setPage(nextPage);
      setHasMore(allFetchedProducts.length > nextSlice.length);
      return;
    }

    // Otherwise request next page from backend
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchProducts(selected, nextPage, true);
  };

  // render helpers
  const labelText =
    selected === "all"
      ? "All Categories"
      : selected.charAt(0).toUpperCase() + selected.slice(1).replace("-", " ");

  return (
    <div className="mx-10 mt-70 ">
      <div className="flex justify-between items-center gap-6 pb-4 ">
        <div className="flex-1"></div>
        <div className="flex-1 text-right ">
          <p className="text-xl">FIlter by catergories</p>
        </div>
        <select
          className="w-1 px-2 py-3 border-2 text-xl  flex-1 border-gray-600 transition duration-700 rounded-lg"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="bone-straight">Bone Straight</option>
          <option value="bouncy">Bouncy Wigs</option>
          <option value="braided">Braided Wigs</option>
          <option value="curly">Curly Wigs</option>
          <option value="long">Long Wigs</option>
          <option value="short">Short Wigs</option>
          <option value="straight">Straight Wigs</option>
        </select>
      </div>
      <hr className="mx-[-40px] border-2 border-gray-500 overflow-hidden" />
      <div className="mt-4 px-4 py-4">
        <p className="text-5xl font-bold text-gray-600">{labelText}</p>

        <div className="border-4 px-4 pt-4 pb-6 border-gray-300 shadow-2xl rounded-3xl my-4 grid grid-cols-2 gap-6">
          {loading && (
            <div className="col-span-2 text-center text-xl">
              Loading products…
            </div>
          )}
          {error && (
            <div className="col-span-2 text-center text-red-500 text-xl">
              {error}
            </div>
          )}
          {!loading && !error && products.length === 0 && (
            <div className="col-span-2 text-center text-xl">
              No products found.
            </div>
          )}

          {!loading &&
            !error &&
            products.map((product) => (
              <HairCard
                key={product.id || product._id || product.productId}
                product={product}
              />
            ))}
        </div>

        {/* Load more area */}
        <div className="mt-6 text-center">
          {loadingMore && <div className="text-xl mb-3">Loading more…</div>}

          {!loading && !loadingMore && hasMore && (
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 rounded-lg text-lg font-semibold shadow-md"
              aria-label="Load more products"
            >
              Load more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterDropDown;
