import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "../utils/formValidator";
import Button from "../utils/Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(resetPasswordSchema) });
  const onSubmit = (data) => {
    console.log("Sign In Data:", data);
  };
  return (
    <div className="min-h-screen rounded-lg text-center mb-110 mx-30">
      <h2 className="text-7xl font-semibold text-[#515456] mb-10">
        Forgot Password
      </h2>
      <p className="text-[#515456] text-4xl mb-10 ">
        Enter your email address and we'll send you a link to reset your
        password
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="grid  relative">
        <p className="text-red-500 text-2xl text-left ">
          {errors.email?.message}
        </p>
        <input
          type="email"
          name="email"
          id=""
          placeholder="Email"
          className="border shadow rounded-xl py-8 mb-8 text-4xl placeholder:text-4xl px-5 placeholder:px-5 placeholder:text-gray-400 bg-white "
          {...register("email")}
        />
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

export default ForgotPassword;
