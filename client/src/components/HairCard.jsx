import React from "react";
import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

const HairCard = ({ product }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!product) return null;

  const { title, images, price_by_length } = product;

  // Helper: returns {min, max} as numbers or null
  const getMinMax = (priceMap) => {
    if (!priceMap || typeof priceMap !== "object") return null;
    const vals = Object.values(priceMap)
      .map((v) => {
        const n = Number(v);
        return Number.isFinite(n) ? Math.round(n) : null;
      })
      .filter((n) => n !== null);
    if (vals.length === 0) return null;
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    return { min, max };
  };

  const moneyFormat = (n) =>
    n == null || !Number.isFinite(n)
      ? "—"
      : `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

  let basePrice = "₦0 - ₦0";
  const mm = getMinMax(price_by_length);
  if (mm) {
    if (mm.min === mm.max) {
      basePrice = moneyFormat(mm.min);
    } else {
      basePrice = `${moneyFormat(mm.min)} - ${moneyFormat(mm.max)}`;
    }
  }

  const handleClick = () => {
    if (product?.id) {
      navigate(`/productdetail/${product.id}`);
    }
  };

  return (
    <div onClick={handleClick}>
      <div className="bg-[#fce0d3] my- rounded-2xl p-6 overflow-hidden shadow-2xl">
        <img src={images} alt={title} className="w-full h-96 rounded-xl" />

        <div className="pt-3">
          <h1 className="text-2xl text-gray-700">{title}</h1>
          <p className="text-3xl font-semibold">{basePrice}</p>
        </div>
      </div>
    </div>
  );
};

export default HairCard;
