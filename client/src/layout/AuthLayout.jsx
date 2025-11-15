import React from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "../assets/single-logo.png";
import bgImg from "../assets/bg.png";

const AuthLayout = () => {
  return (
    <div
      className="min-h-screen w-full bg-cover  bg-center pt-60 flex flex-col items-center justify-start  "
      style={{ minHeight: "100dvh", backgroundImage: `url(${bgImg})` }}
    >
      <div className="flex flex-col items-center w-full flex-1 pt-20">
        <Link className=" " to="/">
          <img
            src={logo}
            alt="logo"
            className=" mt-10 mb-10 w-30 h-30 mx-auto rounded-2xl"
          />
        </Link>
        <div className="w-full flex flex-col items-center mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
