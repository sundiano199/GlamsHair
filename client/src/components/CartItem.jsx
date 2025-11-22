// src/components/CartItem.jsx
import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import SmallButton from "../utils/SmallButton";
import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const { updateQty, removeFromCart } = useCart();

  const handleIncrease = () => updateQty(item.productId, item.quantity + 1);
  const handleDecrease = () => {
    if (item.quantity > 1) updateQty(item.productId, item.quantity - 1);
  };
  const handleRemove = () => removeFromCart(item.productId);

  return (
    <div className="mt-8 grid grid-cols-3 border-b pb-5">
      <div className="col-span-1">
        <img
          src={item.images || "/fallback-image.jpg"}
          alt={item.title}
          className="object-fit h-60 w-[85%] rounded-4xl"
        />
      </div>
      <div className="col-span-2 flex justify-between items-start">
        <div>
          <h1 className="text-2xl text-gray-700 mb-3">{item.title}</h1>
          <h1 className="text-2xl text-gray-700 mb-3">
            Length: {item.length || "N/A"}
          </h1>
          <h2 className="text-4xl font-semibold mb-3">
            ₦ {Number(item.price || 0)}
          </h2>
          <h2 className="text-2xl mb-3">Unit:</h2>

          <div className="flex gap-15 items-center bg-white">
            <SmallButton
              content={"-"}
              className={"py-1 px-4 text-3xl"}
              onClick={handleDecrease}
            />
            <h2 className="font-semibold text-2xl">{item.quantity}</h2>
            <SmallButton
              content={"+"}
              className={"py-1 px-3 text-3xl"}
              onClick={handleIncrease}
            />
          </div>
        </div>
        <div
          className="flex items-center gap-2 bg-[#cc7c66] w-25 px-2 text-white rounded-lg py-1 cursor-pointer"
          onClick={handleRemove}
        >
          <MdDeleteOutline />
          <h1>Remove</h1>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
