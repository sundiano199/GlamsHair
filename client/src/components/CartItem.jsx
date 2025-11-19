import React from "react";
import image from "../assets/img.jpg"
import { MdDeleteOutline } from "react-icons/md";
import SmallButton from "../utils/SmallButton";
const CartItem = () => {
  return (
    <div className=" mt-8  grid grid-cols-3 border-b  pb-5 ">
      <div className="col-span-1">
        <img
          src={image}
          alt=""
          className="object-fit h-60 w-[85%] rounded-4xl"
        />
      </div>
      <div className="col-span-2 flex justify-between items-start">
        <div>
          <h1 className="text-2xl text-gray-700 mb-3">Nice Curly wig</h1>
          <h1 className="text-2xl text-gray-700 mb-3">Length: 21'</h1>

          <h2 className="text-4xl font-semibold mb-3">$300</h2>
          <h2 className="text-2xl mb-3">Unit:</h2>

          <div className="flex gap-15 items-center bg-white">
            <SmallButton content={"-"} className={"py-1 px-4 text-3xl" }/>
            <h2 className="font-semibold text-2xl">3</h2>
            <SmallButton content={"+"} className={"py-1 px-3 text-3xl" } />
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#cc7c66] w-25 px-2 text-white rounded-lg  py-1">
          <MdDeleteOutline />
          <h1>Remove</h1>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
