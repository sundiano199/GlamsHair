// src/components/NavbarCartIcon.jsx
import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";

const NavbarCartIcon = () => {
  const { cart } = useCart();
  const count = cart?.totalItems || 0;

  return (
    <Link to="/cartpage" className="relative inline-block">
      <FaShoppingCart className="text-2xl" />
      {count > 0 && (
        <span
          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center shadow"
          aria-label={`${count} items in cart`}
        >
          {count}
        </span>
      )}
    </Link>
  );
};

export default NavbarCartIcon;
