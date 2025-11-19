import React from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { newPasswordSchema } from "../utils/formValidator";
import Button from "../utils/Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
const NewPasswordReset = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(newPasswordSchema) });
  const onSubmit = (data) => {
    console.log("Sign In Data:", data);
  };
  return (
    <div className="min-h-screen rounded-lg text-center mb-110 mx-30">
      <h2 className="text-7xl font-semibold text-[#515456] mb-10">
        Forgot Password
      </h2>
      <p className="text-[#515456] text-4xl mb-10 ">
        Please enter your new password
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="grid  relative">
        <p className="text-red-500 text-2xl text-left">
          {errors.password?.message}
        </p>
        <div className="relative w-full">
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            id=""
            placeholder="New password"
            className=" w-full border shadow rounded-xl py-8 mb-8 text-4xl placeholder:text-4xl px-5 placeholder:px-5 placeholder:text-gray-400 bg-white "
            {...register("password")}
          />
          {/* Hide password for password */}
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
          <p className="text-red-500 text-2xl text-left">
            {errors.confirmPassword?.message}
          </p>
        </div>
        <div className="w-full relative">
          <input
            type={passwordVisible2 ? "text" : "password"}
            name="confirmPassword"
            id=""
            placeholder="Confirm new password"
            className=" w-full border shadow rounded-xl py-8 mb-8 text-4xl placeholder:text-4xl px-5 placeholder:px-5 placeholder:text-gray-400 bg-white "
            {...register("confirmPassword")}
          />

          {/* Hide Password for repeat password */}
          <div
            className="absolute right-8 top-6"
            onClick={() => setPasswordVisible2((v) => !v)}
          >
            {passwordVisible2 ? (
              <IoMdEyeOff className="text-6xl invert-50" />
            ) : (
              <IoMdEye className="text-6xl invert-50" />
            )}
          </div>
        </div>
        <div className="mb-10">
          <Button
            content={"Reset password"}
            type={"submit"}
            className={"w-full text-5xl "}
          />
        </div>
      </form>
      <Link to="/signin" className="text-[#515456] text-4xl font-semibold ">
        Back to sign in
      </Link>
    </div>
  );
};

export default NewPasswordReset;
