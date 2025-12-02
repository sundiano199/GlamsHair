// src/components/HairCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import normalizeProduct from "@/utils/normalizeProduct";

const HairCard = ({ product: rawProduct, onClick }) => {
  const navigate = useNavigate();
  if (!rawProduct) return null;

  const product = normalizeProduct(rawProduct);
  const { title, images } = product;

  const handleClick = () => {
    if (onClick) {
      onClick(product);
      return;
    }
    // Use app-level id only
    if (product.id) {
      navigate(`/productdetail/${product.id}`);
      return;
    }
    // if product.id missing, don't navigate with mongo _id
    // Optionally fallback here if you want: navigate(`/productdetail/${product._id}`)
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <div className="bg-[#fce0d3] my- rounded-2xl p-6 overflow-hidden shadow-2xl">
        <img src={images} alt={title} className="w-full h-96 rounded-xl" />
        <div className="pt-3">
          <h1 className="text-2xl text-gray-700">{title}</h1>
        </div>
      </div>
    </div>
  );
};

export default HairCard;
