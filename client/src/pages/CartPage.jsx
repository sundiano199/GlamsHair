import React from "react";
import NavBar from "../components/NavBar";
import { MdArrowBack } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import image from "../assets/img.jpg";
import { MdDeleteOutline } from "react-icons/md";
import { RiArrowUpSLine } from "react-icons/ri";
import CartItem from "../components/CartItem";


const CartPage = () => {
  return (
    <div className="mx-10  ">
        <div>
      <div className="fixed top-0 left-0 right-0 bg-[#FFFBF7] border-b border-gray-400">
        <NavBar />
      </div>

      {/* <hr className="border-2 border-gray-400 mt-40 fixed top-[-5px] left-0 right-0" /> */}
      <div className=" flex items-center justify-between pt-45 bg-[#FFFBF7]">
        <IoIosArrowBack size={40} className="text-gray-600" />

        <h2 className="text-3xl font-bold text-gray-600">Cart</h2>
        <div aria-label="empty "></div>
      </div>
      <div>
        <h2 className=" mt-5 text-2xl">CART SUMMARY</h2>
        <div className=" flex justify-between mt-5 border-y-2 p-2">
          <h1 className="text-3xl">Subtotal</h1>
          <h1 className="text-4xl font-semibold">$106,267</h1>
        </div>
      </div>
      </div>
      {/* carts */}
      {/* <div className=" mt-8  grid grid-cols-3 border-b  pb-5 ">
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
          </div>
          <div className="flex items-center gap-2 bg-[#cc7c66] w-25 px-2 text-white rounded-lg  py-1">
            <MdDeleteOutline />
            <h1>Remove</h1>
          </div>
        </div>
      </div> */}
      <div className="pb-35">
        <CartItem />
        <CartItem />
        <CartItem />
        <CartItem />
        <CartItem />
      </div>
    </div>
  );
};

export default CartPage;
