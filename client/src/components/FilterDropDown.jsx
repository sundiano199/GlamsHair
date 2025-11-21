import React from "react";
import { useState } from "react";
import HairCard from "./HairCard";

const FilterDropDown = () => {
  const [selected, setSelected] = useState("all");

  return (
    <div className="mx-10 mt-70 ">
      <div className="flex justify-between items-center gap-6 pb-4 ">
        <div className="flex-1"></div>
        <div className="flex-1 text-right ">
          <p className="text-xl">FIlter by catergories</p>
        </div>
        <select
          className="w-1 px-2 py-3 border-2 text-xl  flex-1 border-gray-600 transition   duration-700 rounded-lg"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="bone-straight">Bone Straight</option>
          <option value="bouncy">Bouncy Wigs</option>
          <option value="braided">Braided Wigs</option>
          <option value="curly">Curly Wigs</option>
          <option value="long">Long Wigs</option>|
          <option value="short">Short Wigs</option>
          <option value="straight">Straight Wigs</option>
        </select>
      </div>
      <hr className="mx-[-40px] border-2 border-gray-500 overflow-hidden" />
      <div className=" mt-4 px-4 py-4">
        <p className="text-5xl   font-bold text-gray-600  ">
          {selected === "all"
            ? "All Categories"
            : selected === "braided"
            ? "Braided Wigs"
            : selected === "curly"
            ? "Curly Wigs"
            : ""}
        </p>

        {/* HairCard */}
        <div className="border-4 px-4 pt-4 pb-6 border-gray-300 shadow-2xl  rounded-3xl my-4 grid grid-cols-2 gap-6">
          <HairCard />
          <HairCard />
          <HairCard />
          <HairCard />
          <HairCard />
          <HairCard />
          <HairCard />
          <HairCard />
          <HairCard />
          <HairCard />
          <HairCard />
        </div>
      </div>
    </div>
  );
};

export default FilterDropDown;
