import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import Logo from "../assets/single-logo.png";
import { IoCartOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiMiniHome } from "react-icons/hi2";
import { PiShoppingBagOpenFill } from "react-icons/pi";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { SiMoneygram } from "react-icons/si";
import { useLocation } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
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
            location.pathname === "/cartpage" ? (
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
            location.pathname === "/cartpage" ? (
              <IoIosSearch size={70} />
            ) : (
              ""
            )}
            {/* cart logo */}

            <IoCartOutline size={70} />
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
          <div className="flex justify-between items-center  border-2 border-gray-400 rounded-lg p-2 mt-15 ">
            <FaUserAlt size={40} />
            <div>
              <h1 className="text-3xl  font-semibold">Emmanuel</h1>

              <p className="text-lg">iamdyclef@gmail.com</p>
            </div>
            <MdKeyboardArrowDown size={30} />
          </div>
          <ul className="space-y-4 text-lg mt-10">
            <div className="flex gap-3  items-center  mb-5">
              <HiMiniHome size={30} />
              <li className="cursor-pointer text-3xl font-semibold ">Home</li>
            </div>
            <div className="flex gap-3  items-center mb-5">
              <PiShoppingBagOpenFill size={30} />
              <li className="cursor-pointer text-3xl font-semibold">Orders</li>
            </div>
            <div className="flex gap-3  items-center mb-5">
              <BiSolidCategoryAlt size={30} />
              <li className="cursor-pointer text-3xl font-semibold">
                Categories
              </li>
              <MdKeyboardArrowDown size={30} className="ml-8" />
            </div>
            <div className="flex gap-3  items-center mb-5">
              <SiMoneygram size={30} />
              <li className="cursor-pointer text-3xl font-semibold">
                Preorder
              </li>
            </div>
          </ul>
        </div>
        <div>
          {location.pathname === "/productdetail" ? (
            <div className="fixed bottom-0 left-0 right-0 mx-10 z-30">
              <div className="bg-[#FFFBF7] h-6 w-full"></div>
              <button className="flex justify-between items-center bg-[#cc7c66]  w-full  rounded-xl py-3 px-6  shadow-lg">
                <IoCartOutline size={70} className="text-white" />
                <h1 className="text-3xl font-bold text-white">Add to Cart</h1>
                <div></div>
              </button>
            </div>
          ) : null}
        </div>
        <div>
          {location.pathname === "/cartpage" ? (
            <div className="fixed bottom-0 left-0 right-0 mx-10 z-30">
              <div className="bg-[#FFFBF7] h-6 w-full"></div>
              <button className=" bg-[#cc7c66]  w-full  rounded-xl py-3 px-6  shadow-lg">
                <h1 className="text-4xl py-4 font-bold text-white  items-center block">
                  Checkout ($106,267)
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
