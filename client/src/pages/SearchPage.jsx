import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import HairCard from "../components/HairCard";

const SearchPage = () => {
  const [text, setText] = useState("");
  return (
    <div>
      <div className="px-10 relative  border-b-5 border-gray-500 pb-4 mt-6">
        <div>
          <input
            type="text"
            placeholder={text.length === 0 ? "Search products..." : ""}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border-5 border-gray-500 bg-white h-20  w-full rounded-4xl placeholder:text-4xl placeholder:pl-22 pt-3"
          />
        </div>
        <div className="absolute top-4 left-5">
          {text.length === 0 && (
            <IoIosSearch
              size={50}
              className="absolute left-10 text-gray-500 "
            />
          )}
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-semibold py-5 text-center border-b-2 border-r-gray-500">
          Search Result(s)...
        </h1>
        <h2 className=" text-center  my-2 text-2xl  ">
          Found 1 result(s) for your search
        </h2>
        {/* if statement will return this if theres result */}
        <div className="border-4 px-4 pt-4 pb-6 border-gray-300 shadow-2xl  rounded-3xl my-4 grid grid-cols-2 gap-6 mx-10">
          <HairCard />
        </div>
        {/* if no match  */}
      </div>
      <div>
        <h2 className="text-center">Back to Main menu</h2>
      </div>
    </div>
  );
};

export default SearchPage;
