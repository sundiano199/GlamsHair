import React from "react";
import Home from "../pages/Home";
import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 bg-[#FFFBF7]">
        <NavBar />
      </div>
      <Outlet />
    </div>
  );
};

export default RootLayout;
