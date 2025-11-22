import React from "react";
import { useAuth } from "../context/AuthContext";
import fallbackImage from "../assets/img.jpg";
import { useNavigate } from "react-router-dom";

const HairCard = ({ product }) => {
  const { user } = useAuth(); // correct usage
  const navigate = useNavigate();

  if (!product) return null;

  const { title, images, price_by_length } = product;

  // Compute min and max price dynamically
  let basePrice = "₦0 - ₦0"; // fallback
  if (price_by_length) {
    const lengths = Object.keys(price_by_length).sort(
      (a, b) => Number(a) - Number(b)
    );
    const minLength = lengths[0];
    const maxLength = lengths[lengths.length - 1];

    const minPrice = price_by_length[minLength].toLocaleString("en-NG", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
    const maxPrice = price_by_length[maxLength].toLocaleString("en-NG", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });

    basePrice = `₦${minPrice}  -  ₦${maxPrice}`;
  }
  const handleClick = () => {
    if (product?.id) {
      navigate(`/productdetail/${product.id}`); // pass the id
    }
    // Navigate to product detail page
    // Optionally, pass product ID or slug for dynamic routing
    
  };
  return (
    <div onClick={handleClick}>
      <div className="bg-[#fce0d3] my- rounded-2xl p-6 overflow-hidden shadow-2xl">
        <img
          src={images || fallbackImage}
          alt={title}
          className="w-full h-96 rounded-xl"
        />

        <div className="pt-3">
          <h1 className="text-2xl text-gray-700">{title}</h1>
          <p className="text-3xl font-semibold">{basePrice}</p>
        </div>
      </div>
    </div>
  );
};

export default HairCard;
