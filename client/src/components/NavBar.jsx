import React, { useState } from "react";
import { IoMenu, IoClose, IoCartOutline } from "react-icons/io5";
import Logo from "../assets/single-logo.png";
import { IoIosSearch } from "react-icons/io";

import { MdKeyboardArrowDown } from "react-icons/md";
import { HiMiniHome } from "react-icons/hi2";

import { BiSolidCategoryAlt } from "react-icons/bi";
import { SiMoneygram } from "react-icons/si";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaHeart } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Categories from "./Categories";
import LogoutButton from "./LogoutButton";
import User from "./User";
import { PiShoppingBagOpenFill } from "react-icons/pi";

import { MdLiveHelp } from "react-icons/md";

const NavBar = () => {
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart(); // ✅ get cart from context

  return (
    <div className="  ">
      <div>
        <nav className="flex justify-between  items-center mx-10 my-4 ">
          {/* icon */}
          <div className="flex gap-10">
            <IoMenu
              size={70}
              className="cursor-pointer  "
              onClick={() => setOpen(true)}
            />
            {location.pathname === "/productdetail" ||
            location.pathname === "/cartpage" ||
            location.pathname === "/orders" ? (
              <IoIosSearch size={70} className="invisible" />
            ) : (
              ""
            )}
          </div>
          {/* logo */}
          <button onClick={() => navigate("/")}>
            <div className="flex flex-col items-center gap-2">
              <img src={Logo} alt="logo" className="  w-20 h-20 rounded-2xl" />
              <h2 className="text-[#cc7c66] font-bold text-center text-3xl libre-bodoni">
                GLAMSHAIR
              </h2>
            </div>
          </button>
          <div className="flex gap-10">
            {location.pathname === "/productdetail" ||
            location.pathname === "/cartpage" ||
            location.pathname === "/orders" ? (
              <IoIosSearch size={70} />
            ) : (
              ""
            )}
            {/* cart logo with badge */}
            <div
              className="relative cursor-pointer"
              onClick={() => navigate("/cartpage")}
            >
              <IoCartOutline size={70} />
              {cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full px-4 font-bold text-xl">
                  {cart.totalItems}
                </span>
              )}
            </div>
          </div>
        </nav>

        {/* SIDE MENU OVERLAY */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
            onClick={() => setOpen(false)}
          ></div>
        )}

        <div
          className={`fixed top-0 left-0 h-[98%] w-[35%] bg-[#fce0d3] px-8 p-6 z-50 my-3 rounded-2xl shadow-lg transform transition-transform duration-800 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* CLOSE ICON */}
          <IoClose
            size={70}
            className="cursor-pointer mb-6"
            onClick={() => setOpen(false)}
          />

          {/* MENU ITEMS */}
          <User />

          <ul className="space-y-4 text-lg mt-10">
            <Link to="/" onClick={() => setOpen(false)}>
              <div className="flex gap-3  items-center mb-5">
                <HiMiniHome size={30} />
                <h1 className="cursor-pointer text-3xl font-semibold ">Home</h1>
              </div>
            </Link>

            <div>
              <Categories />
            </div>

            <div>
              <Link
                to="/orders"
                onClick={() => setOpen(false)
                  
                }
                className="flex gap-3  items-center mb-5"
              >
                <PiShoppingBagOpenFill size={30} />
                <h1 className="cursor-pointer text-3xl font-semibold">
                  Orders
                </h1>
              </Link>
            </div>

            <div className="flex gap-3  items-center  mb-5">
              <FaHeart size={30} />
              <li className="cursor-pointer text-3xl font-semibold ">
                Wishlist{" "}
              </li>
            </div>
            <div className="flex gap-3  items-center mb-5">
              <SiMoneygram size={30} />
              <li className="cursor-pointer text-3xl font-semibold">
                Preorder
              </li>
            </div>
            <button className="flex gap-3 items-center mb-5">
              <MdLiveHelp size={30} />
              <h1 className="cursor-pointer text-3xl font-semibold">Help</h1>
            </button>
          </ul>
          <LogoutButton />
        </div>

        <div>
          {location.pathname === "/cartpage/" ? (
            <div className="fixed bottom-0 left-0 right-0 mx-10 z-30">
              <div className="bg-[#FFFBF7] h-6 w-full"></div>
              <button className=" bg-[#cc7c66]  w-full  rounded-xl py-3 px-6  shadow-lg">
                <h1 className="text-4xl py-4 font-bold text-white  items-center block">
                  Checkout (${cart.subtotal})
                </h1>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
