import React, { useEffect, useState, useRef } from "react";
import HairCard from "./HairCard";
import axiosInstance from "../utils/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;

const FilterDropDown = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get category and search from URL
  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get("category") || "all";
  const searchFromURL = queryParams.get("search") || ""; // <-- new

  const [selected, setSelected] = useState(categoryFromURL);
  const [products, setProducts] = useState([]);
  const [allFetchedProducts, setAllFetchedProducts] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const lastRequested = useRef({ category: null, page: 1, search: "" });

  const fetchProducts = async (
    category,
    nextPage = 1,
    append = false,
    search = ""
  ) => {
    setError(null);
    if (!append) setLoading(true);
    else setLoadingMore(true);

    lastRequested.current = { category, page: nextPage, search };

    try {
      const res = await axiosInstance.get("/products", {
        params: {
          category: category === "all" ? undefined : category,
          search: search.trim() || undefined, // <-- search param
          page: nextPage,
          limit: PAGE_SIZE,
        },
      });

      const data = res.data;
      let returnedProducts = [];
      let total;

      if (Array.isArray(data)) returnedProducts = data;
      else if (Array.isArray(data.products)) {
        returnedProducts = data.products;
        if (typeof data.total === "number") total = data.total;
      }

      const returnedCount = returnedProducts.length;

      const seemsToBeFullList =
        !data.page &&
        !data.limit &&
        typeof data.total === "undefined" &&
        (returnedProducts.length > PAGE_SIZE || page === 1);

      if (seemsToBeFullList) {
        setAllFetchedProducts(returnedProducts);
        const slice = returnedProducts.slice(0, PAGE_SIZE * nextPage);
        setProducts(slice);
        setHasMore(returnedProducts.length > slice.length);
      } else if (typeof total === "number") {
        if (append) setProducts((prev) => [...prev, ...returnedProducts]);
        else setProducts(returnedProducts);

        const accumulated = append
          ? products.length + returnedCount
          : returnedCount;
        setHasMore(accumulated < total);
      } else {
        if (append) setProducts((prev) => [...prev, ...returnedProducts]);
        else setProducts(returnedProducts);
        setHasMore(returnedCount >= PAGE_SIZE);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to fetch products");
      setProducts([]);
      setAllFetchedProducts(null);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Update when URL category or search changes
  useEffect(() => {
    setSelected(categoryFromURL); // <-- this forces dropdown to reset
    setPage(1);
    setProducts([]);
    setAllFetchedProducts(null);
    setHasMore(false);
    fetchProducts(categoryFromURL, 1, false, searchFromURL);
  }, [categoryFromURL, searchFromURL]);

  // Replace the handleSelect function with this
  const handleSelect = (e) => {
    const newCategory = e.target.value;

    // Update state immediately so dropdown reflects selected category
    setSelected(newCategory);

    // Preserve search in URL
    const query = new URLSearchParams(location.search);
    if (searchFromURL) query.set("search", searchFromURL);
    query.set("category", newCategory);
    navigate(`/products?${query.toString()}`);
  };

  const handleLoadMore = async () => {
    if (allFetchedProducts) {
      const nextPage = page + 1;
      const nextSlice = allFetchedProducts.slice(0, PAGE_SIZE * nextPage);
      setProducts(nextSlice);
      setPage(nextPage);
      setHasMore(allFetchedProducts.length > nextSlice.length);
      return;
    }

    const nextPage = page + 1;
    setPage(nextPage);
    await fetchProducts(selected, nextPage, true, searchFromURL);
  };

  const labelText =
    selected === "all"
      ? "All Categories"
      : selected.charAt(0).toUpperCase() + selected.slice(1).replace("-", " ");

  return (
    <div className=" mx-8">
      <hr className="mx-[-40px] border border-gray-300 overflow-hidden mb-4 " />
      <div className="flex justify-between items-center gap-6 pb-4 ">
        <div className="flex-1"></div>
        <div className="flex-1 text-right">
          <p className="text-xl">Filter by categories</p>
        </div>
        <select
          className="w-1 px-2 py-3 border-2 text-xl flex-1 border-gray-600 transition duration-700 rounded-lg"
          value={selected}
          onChange={handleSelect}
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

      <hr className="mx-[-40px] border-2 border-gray-300 overflow-hidden" />

      <div className="mt-4 p-4">
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
            products.map((rawProduct) => {
              // normalize product to always have .id
              const id =
                (rawProduct &&
                  (rawProduct.id || rawProduct._id || rawProduct.productId)) ||
                (typeof rawProduct === "string" ? rawProduct : null);

              const product =
                typeof rawProduct === "object" && rawProduct !== null
                  ? { ...rawProduct, id }
                  : { id, title: "", images: "" };

              return (
                <HairCard
                  key={
                    product.id ||
                    product._id ||
                    product.productId ||
                    Math.random()
                  }
                  product={product}
                />
              );
            })}
        </div>

        <div className="mt-6 text-center">
          {loadingMore && <div className="text-xl mb-3">Loading more…</div>}
          {!loading && !loadingMore && hasMore && (
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 rounded-lg text-lg font-semibold shadow-md"
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
