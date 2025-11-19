import React from "react";
import NavBar from "../components/NavBar";
import { MdArrowBack } from "react-icons/md";
import img from "../assets/img.jpg";
import { AiOutlineInfoCircle } from "react-icons/ai";
import SmallButton from "../utils/SmallButton";
import { FaRegHeart } from "react-icons/fa6";
import { IoShareSocial } from "react-icons/io5";

import { IoCartOutline } from "react-icons/io5";
import Carousel from "../components/Carousel";
import SmallCard from "../components/SmallCard";
import { RiArrowUpSLine } from "react-icons/ri";
const ProductDetail = () => {
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 bg-[#FFFBF7] border-b border-gray-400">
        <NavBar />
      </div>

      {/* <hr className="border-2 border-gray-400 mt-40 fixed top-[-5px] left-0 right-0 z-10" /> */}
      <div className="mx-10 flex items-center justify-between pt-45 bg-[#FFFBF7]">
        <MdArrowBack size={40} className="text-gray-600 " />
        <h2 className="text-3xl font-bold text-gray-600">Product Detail</h2>
        <div aria-label="empty "></div>
      </div>

      <div className="h-full bg-[#Fce0d3] mx-10 rounded-3xl my-5">
        <img
          src={img}
          alt=""
          className="object-cover w-[65%] h-full rounded-3xl mx-auto  py-5"
        />
      </div>
      <div className="mx-10  ">
        <div className="flex justify-between items-center pr-3">
          <h1 className="text-2xl mb-2">Nice Curly Wig</h1>
          <div className="flex gap-10">
            <IoShareSocial size={50} />
            <FaRegHeart size={50} />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-semibold mb-2">$70.00</h2>
          <h3 className="text-md mb-2">In stock</h3>
        </div>
      </div>
      <div className="flex mx-10 gap-3 mb-2">
        <AiOutlineInfoCircle size={30} />
        <p className="text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
      <div className="mx-10 text-2xl ">
        <h1 className="font-semibold mb-2">VARIATIONS:</h1>
        <div className="">
          <h1 className="mb-2">Length (inches)</h1>
          <div className="flex gap-3.5">
            <SmallButton content={"21'"} />
            <SmallButton content={"24'"} />
            <SmallButton content={"28'"} />
          </div>
        </div>
      </div>
      <hr className="my-4 border-2 border-gray-500" />
      <div className="mx-10 text-center text-2xl">
        <h1>Questions about this product?</h1>
        <h2 className="text-[#cc7c66] ">Contact Us</h2>
      </div>
      <hr className="my-4 border-2 border-gray-500" />
      <div className="mx-10 mb-8">
        <h1 className="text-3xl font-semibold mb-2">Customers also viewed</h1>
        <div className="grid grid-cols-5 gap-2 ">
          <SmallCard />
          <SmallCard /> <SmallCard /> <SmallCard /> <SmallCard /> <SmallCard />
        </div>
      </div>
      <hr className="my-4 border-2 border-gray-500" />
      <div className="mx-10 mb-40">
        <h1 className="text-3xl font-semibold mb-2">Best Selling</h1>
        <div className="grid grid-cols-5 gap-2 ">
          <SmallCard />
          <SmallCard /> <SmallCard /> <SmallCard /> <SmallCard /> <SmallCard />
        </div>
      </div>

      <div className="py-4 mb-40 text-center bg-black text-white">
        <RiArrowUpSLine size={20} className="mx-auto " />
        <h1 className="text-lg">Back to top</h1>
      </div>

      {/* <div className="fixed bottom-0 left-0 right-0 mx-10 z-30">
        <div className="bg-[#FFFBF7] h-6 w-full"></div>
        <button className="flex justify-between items-center bg-[#cc7c66]  w-full  rounded-xl py-3 px-6  shadow-lg">
          <IoCartOutline size={70} className="text-white" />
          <h1 className="text-3xl font-bold text-white">Add to Cart</h1>
          <div></div>
        </button>
      </div> */}
    </div>
  );
};

export default ProductDetail;
