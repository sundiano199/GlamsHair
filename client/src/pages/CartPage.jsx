// src/pages/CartPage.jsx
import React from "react";
import NavBar from "../components/NavBar";
import { IoIosArrowBack } from "react-icons/io";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cart } = useCart();

  if (cart.loading) return <div>Loading cart...</div>;

  return (
    <div className="mx-10">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 bg-[#FFFBF7] border-b border-gray-400">
        <NavBar />
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between pt-45 bg-[#FFFBF7]">
        <IoIosArrowBack size={40} className="text-gray-600" />
        <h2 className="text-3xl font-bold text-gray-600">Cart</h2>
        <div aria-label="empty "></div>
      </div>

      {/* Cart Summary */}
      <h2 className="mt-5 text-2xl">CART SUMMARY</h2>
      <div className="flex justify-between mt-5 border-y-2 p-2">
        <h1 className="text-3xl">Subtotal</h1>
        <h1 className="text-4xl font-semibold">₦ {cart.subtotal}</h1>
      </div>

      {/* Cart Items */}
      <div className="pb-35">
        {cart.items.length === 0 ? (
          <h2 className="mt-10 text-2xl">Your cart is empty</h2>
        ) : (
          cart.items.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default CartPage;
