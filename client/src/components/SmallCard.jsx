import React from "react";
import img from "../assets/img.jpg";

const SmallCard = () => {
  return (
    <div className="mb-2 w-full">
      <img src={img} alt="" />
      <p>Nice Curly WIg</p>
      <h2>$300</h2>
    </div>
  );
};

export default SmallCard;
