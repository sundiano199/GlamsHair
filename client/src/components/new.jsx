import { useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";

const NavBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow p-4 flex justify-between items-center z-50">
        <h1 className="text-xl font-bold">My Website</h1>

        {/* MENU ICON */}
        <IoMdMenu
          size={30}
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        />
      </nav>

      {/* SIDE MENU OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* SIDE MENU PANEL */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white p-6 z-50 shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* CLOSE ICON */}
        <IoMdClose
          size={30}
          className="cursor-pointer mb-6"
          onClick={() => setOpen(false)}
        />

        {/* MENU ITEMS */}
        <ul className="space-y-4 text-lg">
          <li className="cursor-pointer">Home</li>
          <li className="cursor-pointer">Profile</li>
          <li className="cursor-pointer">Orders</li>
          <li className="cursor-pointer">Settings</li>
        </ul>
      </div>
    </>
  );
};

export default NavBar;
