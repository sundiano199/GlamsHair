import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import SmallButton from "../utils/SmallButton";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const CartItem = ({ item }) => {
  const { updateQty, removeFromCart } = useCart();

  // Robust parser: accept numbers or strings with commas/dots and return a Number (Naira integer)
  const coerceToNumber = (v) => {
    if (v === null || v === undefined) return NaN;
    if (typeof v === "number") return Number.isFinite(v) ? Math.round(v) : NaN;

    let s = String(v).trim();
    // Remove currency symbols and spaces
    s = s.replace(/[^\d.,-]/g, "");
    // Remove commas (thousand separators)
    s = s.replace(/,/g, "");
    // Handle dots: if multiple dots, treat all but last as thousand separators
    const parts = s.split(".");
    if (parts.length > 2) {
      const last = parts.pop();
      s = parts.join("") + "." + last;
    }
    // If dot is present and fractional part length === 0 or length === 3 treat as thousand separators
    const n = parseFloat(s);
    return Number.isFinite(n) ? Math.round(n) : NaN;
  };

  const formatPrice = (num) => {
    if (!Number.isFinite(num)) return "₦0";
    return `₦${num.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
  };

  // Unit price may be string or number — keep the exact provided value for parsing
  const unitPriceNum = coerceToNumber(item.price);
  const qtyNum = Number(item.quantity) || 0;
  const subtotalNum = Number.isFinite(unitPriceNum) ? unitPriceNum * qtyNum : 0;

  const handleIncrease = async () => {
    try {
      const newQty = qtyNum + 1;
      await updateQty(item.productId, newQty);
      toast.success("Added one item to cart");
    } catch (err) {
      console.error("increase qty error:", err);
      toast.error("Could not add item");
    }
  };

  const handleDecrease = async () => {
    try {
      if (qtyNum > 1) {
        const newQty = qtyNum - 1;
        await updateQty(item.productId, newQty);
        toast.success("Removed one item from cart");
      }
    } catch (err) {
      console.error("decrease qty error:", err);
      toast.error("Could not remove item");
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(item.productId);
      toast.success("Removed item from cart");
    } catch (err) {
      console.error("remove item error:", err);
      toast.error("Could not remove item");
    }
  };

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

          {/* Subtotal displayed here (unitPrice * quantity), formatted */}
          <h2 className="text-4xl font-semibold mb-3">
            {formatPrice(subtotalNum)}
          </h2>

          {/* Unit label and formatted unit price */}
          <h2 className="text-2xl mb-3">Unit: {formatPrice(unitPriceNum)}</h2>

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
