import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import HairCard from "../components/HairCard";
import NavBar from "@/components/NavBar";
import { Link } from "react-router-dom";
import axiosInstance from "@/utils/axiosConfig";

const SearchPage = () => {
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (text.trim() === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/products?search=${text}`);
        setResults(data.products || []); // <-- fix here
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
      }
      setLoading(false);
    };

    // Debounce to avoid too many requests
    const timer = setTimeout(() => {
      fetchResults();
    }, 300); // wait 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div>
      <NavBar />
      <div className="px-10 relative border-y-5 border-gray-500 py-4 mt-6">
        <div>
          <input
            type="text"
            placeholder="Search products..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border-5 border-gray-500 bg-white h-20 w-full rounded-4xl placeholder:text-4xl placeholder:pl-22 pt-3"
          />
        </div>
        <div className="absolute top-8 left-5">
          {text.length === 0 && (
            <IoIosSearch size={50} className="absolute left-10 text-gray-500" />
          )}
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-semibold py-5 text-center border-b-2 border-r-gray-500">
          Search Result(s)...
        </h1>
        {loading ? (
          <h2 className="text-center my-2 text-2xl">Loading...</h2>
        ) : (
          <>
            <h2 className="text-center my-2 text-2xl">
              Found {results.length} result(s) for "{text}"
            </h2>

            {results.length > 0 ? (
              <div className="border-4 px-4 pt-4 pb-6 border-gray-300 shadow-2xl rounded-3xl my-4 grid grid-cols-2 gap-6 mx-10">
                {results.map((product) => (
                  <HairCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <h2 className="text-center my-4 text-xl">No products found.</h2>
            )}
          </>
        )}
      </div>

      <div>
        <Link to="/">
          <h2 className="text-center">Back to Main menu</h2>
        </Link>
      </div>
    </div>
  );
};

export default SearchPage;
