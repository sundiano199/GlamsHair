import React from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "../assets/single-logo.png";
import bgImg from "../assets/bg.png"

const AuthLayout = () => {
  return (
    <div
      className="h-full w-full bg-cover bg-center py-60 overflow-hidden"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <Link className=" " to="/">
        <img
          src={logo}
          alt=""
          className=" mt-10 mb-10 w-30 h-30 mx-auto rounded-2xl"
        />
      </Link>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
