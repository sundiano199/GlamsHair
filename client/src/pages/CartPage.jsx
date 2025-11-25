import React from "react";
import NavBar from "../components/NavBar";
import { IoIosArrowBack } from "react-icons/io";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  if (cart.loading) return <div>Loading cart...</div>;

  const formatPrice = (num) =>
    `₦${num.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

  return (
    <div className="mx-10 pb-40">
      {" "}
      {/* Add bottom padding for sticky button */}
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 bg-[#FFFBF7] border-b border-gray-400 z-10">
        <NavBar />
      </div>
      {/* Page Header */}
      <div className="flex items-center justify-between pt-45 bg-[#FFFBF7]">
        <IoIosArrowBack
          size={40}
          className="text-gray-600 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-3xl font-bold text-gray-600">Cart</h2>
        <div aria-label="empty "></div>
      </div>
      {/* Cart Summary */}
      <h2 className="mt-5 text-2xl">CART SUMMARY</h2>
      <div className="flex justify-between mt-5 border-y-2 p-2">
        <h1 className="text-3xl">Subtotal</h1>
        <h1 className="text-4xl font-semibold">{formatPrice(cart.subtotal)}</h1>
      </div>
      {/* Cart Items */}
      <div className="mt-5">
        {cart.items.length === 0 ? (
          <h2 className="mt-10 text-2xl">Your cart is empty</h2>
        ) : (
          cart.items.map((item) => <CartItem key={item.id} item={item} />)
        )}
      </div>
      {/* Sticky Proceed to Checkout Button */}
      {cart.items.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t border-gray-300 z-20">
          <button
            className="w-full bg-[#FBBF24] hover:bg-[#F59E0B] text-white text-xl py-4 font-bold rounded-lg shadow-md"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
