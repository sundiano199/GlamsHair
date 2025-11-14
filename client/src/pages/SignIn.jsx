import React from "react";
import logo from "../assets/single-logo.png";
import Button from "../utils/Button";
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <div className="rounded-lg text-center mx-15">
      <h2 className="text-7xl font-semibold text-[#515456] mb-20">Sign in</h2>
      <form className="grid ">
        <input
          type="email"
          name=""
          id=""
          placeholder="Email"
          className="border shadow rounded-xl py-8 mb-8 placeholder:text-4xl placeholder:px-5 placeholder:text-gray-400 bg-white"
        />
        <input
          type="password"
          name=""
          id=""
          placeholder="Password"
          className="border shadow rounded-xl py-8 mb-8 placeholder:text-4xl placeholder:px-5 placeholder:text-gray-400 bg-white "
        />

        <Button
          content={"Sign In"}
          type={"submit"}
          className={"w-full text-5xl "}
        />
        <p className="text-[#515456] text-4xl mt-5 font-semi-bold ">
          Forgot password?
        </p>
      </form>

      <div className="flex justify-center items-center gap-2 mt-110">
        <p className="text-[#515456] text-4xl  font-semibold">
          Don't have an account?{" "}
        </p>
        <Link to="/signup" className="">Sign Up</Link>
      </div>
    </div>
  );
};

export default SignIn;
