import React from "react";
import image from "../assets/img.jpg";

const HairCard = () => {
  return (
    <div
    //   className="overflow-hidden
    //          transition-all duration-300 transform
    //          hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-black/30"
    >
      <div className="bg-[#fce0d3]   my-  rounded-2xl p-6 overflow-hidden shadow-2xl">
        <img src={image} alt="" className="w-full h-96 rounded-xl" />

        <div className="pt-3">
          <h1 className="text-2xl text-gray-700">Nice Curly Wig</h1>
          <p className="text-3xl font-semibold">$50.10</p>
        </div>
      </div>
    </div>
  );
};

export default HairCard;
