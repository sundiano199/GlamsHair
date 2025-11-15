import React from "react";
import logo from "../assets/single-logo.png";
import Button from "../utils/Button";
import { Link } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../utils/formValidator";
const SignUp = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signUpSchema) });
  const onSubmit = (data) => {
    console.log("Sign In Data:", data);
  };
  return (
    <div className="rounded-lg text-center pb-35">
      <h2 className="text-7xl font-semibold text-[#515456] mb-10">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid relative">
        <p className="text-red-500 text-2xl text-left">
          {errors.fullName?.message}
        </p>

        <input
          type="text"
          placeholder="Full name"
          name="fullName"
          className="border shadow rounded-xl py-8 mb-8 text-4xl placeholder:text-4xl px-5 placeholder:px-5 placeholder:text-gray-400 bg-white "
          {...register("fullName")}
        />
        <p className="text-red-500 text-2xl text-left">
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
        {/* <input
          type="number"
          name=""
          id=""
          placeholder="Mobile number"
          className="border shadow rounded-xl py-8 mb-8 text-4xl placeholder:text-4xl px-5 placeholder:px-5 placeholder:text-gray-400 bg-white "
        /> */}
        {errors.phone && (
          <p className="text-red-500 text-2xl text-left">
            {errors.phone.message}
          </p>
        )}

        <Controller
          name="phone"
          control={control}
          defaultValue=""
          rules={{
            validate: (value) =>
              isValidPhoneNumber(value) || "Enter a valid phone number",
          }}
          render={({ field }) => (
            <PhoneInput
              placeholder="Mobile number"
              name="phone"
              value={phoneNumber}
              onChange={setPhoneNumber}
              defaultCountry="NG"
              international={true}
              countryCallingCodeEditable={false}
              className="w-full border shadow rounded-xl py-8 mb-8 text-4xl placeholder:text-4xl px-5 placeholder:px-5 placeholder:text-gray-400 bg-white "
            />
          )}
        />
        <p className="text-red-500 text-2xl text-left">
          {errors.password?.message}
        </p>
        <div className="relative w-full">
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            id=""
            placeholder="Password"
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
            placeholder="Confirm Password"
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

        <Button
          content={"Sign up"}
          type={"submit"}
          className={"w-full text-5xl "}
        />
      </form>

      <div className="flex justify-center items-center gap-2 mt-8">
        <p className="text-[#515456] text-4xl  ">Already have an account? </p>
        <Link to="/signin" className="text-[#515456] text-4xl font-semibold">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
