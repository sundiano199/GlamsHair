import React from "react";
import logo from "../assets/single-logo.png";
import Button from "../utils/Button";
import { Link } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { signInSchema } from "../utils/formValidator";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../context/AuthContext";
const SignIn = () => {
  const { login } = useAuth();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signInSchema) });
  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      console.log("Sign In Data:", data);
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="rounded-lg text-center pt-12 pb-100">
      <h2 className="text-7xl font-semibold text-[#515456] mb-20">Sign in</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid ">
        <p className="text-red-500 text-2xl text-left">
          {errors.email?.message}
        </p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className=" border shadow rounded-xl py-8 mb-8 text-4xl placeholder:text-4xl px-5 placeholder:px-5 placeholder:text-gray-400 bg-white "
          {...register("email")}
        />

        <p className="text-red-500 text-2xl text-left">
          {errors.password?.message}
        </p>
        <div className="relative">
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            placeholder="Password"
            className=" relative border shadow rounded-xl py-8 mb-8 text-4xl placeholder:text-4xl px-5 placeholder:px-5 placeholder:text-gray-400 bg-white "
            {...register("password")}
          />

          <div
            className="absolute right-8 top-6"
            onClick={() => setPasswordVisible((v) => !v)}
          >
            {passwordVisible ? (
              <IoMdEyeOff className="text-6xl invert-50" />
            ) : (
              <IoMdEye className="text-6xl invert-50" />
            )}
          </div>
        </div>

        <Button
          content={"Sign In"}
          type={"submit"}
          className={"w-full text-5xl "}
        />

        <div className="mt-5">
          <Link to="/forgot-password" className="text-[#515456] text-4xl  ">
            Forgot password?
          </Link>
        </div>
      </form>
      {/* <hr className="border border-b-black mt-5" /> */}

      <div className="flex justify-center items-center gap-2 mt-8">
        <p className="text-[#515456] text-4xl  ">Don't have an account? </p>
        <Link to="/signup" className="text-[#515456] text-4xl font-semibold">
          Sign Up
        </Link>
      </div>
    </div>
  );
};
export default SignIn;
