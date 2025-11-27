import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const handleFocus = () => {
    navigate("/searchpage"); 
  };

  return (
    <div className="mt-45">
      <div className="px-10 relative border-y-5 border-gray-500 pb-4 pt-4">
        <div>
          <input
            type="text"
            onFocus={handleFocus} // 🔥 when user clicks → redirect
            placeholder={text.length === 0 ? "Search products..." : ""}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border-5 border-gray-500 bg-white h-20 w-full rounded-4xl 
                       placeholder:text-4xl placeholder:pl-22 pt-3"
          />
        </div>

        <div className="absolute top-8 left-5">
          {text.length === 0 && (
            <IoIosSearch size={50} className="absolute left-10 text-gray-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
