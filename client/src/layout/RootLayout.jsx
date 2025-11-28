import React from "react";
import Home from "../pages/Home";
import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div>
      <div className="sticky top-0 left-0 right-0 bg-[#FFFBF7] border-b-2 border-gray-400 z-50">
        <NavBar />
      </div>
      <div className="z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
