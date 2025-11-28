import React from "react";
import Home from "../pages/Home";
import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div>
      <div className="sticky top-0 left-0 right-0 bg-[#FFFBF7] border-b-2 border-gray-400">
        <NavBar />
      </div>
      <Outlet />
    </div>
  );
};

export default RootLayout;
