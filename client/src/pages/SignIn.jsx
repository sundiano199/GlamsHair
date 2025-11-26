import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "../utils/formValidator";
import { useAuth } from "../context/AuthContext";
import Button from "../utils/Button";
import toast from "react-hot-toast"; // import toast

const SignIn = () => {
  const { login } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signInSchema) });

  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.password);

      if (!result || result.success === false) {
        const msg = result?.error || "Login failed";
        toast.error(msg);
        return;
      }

      // result.success === true
      const fullName = result.user?.fullName ?? "";
      const cleaned = fullName.trim();
      let displayName = "User";
      if (cleaned) {
        const parts = cleaned.split(/\s+/);
        displayName = parts.length > 1 ? parts[1] : parts[0];
      }

      toast.success(`Welcome ${displayName}`, { duration: 6000 });

      // navigate after toast so user sees the message
      // you can add a small delay if you want the toast to show before navigation:
      // setTimeout(() => navigate("/"), 600);
      navigate("/");
    } catch (err) {
      console.error("unexpected onSubmit error:", err);
      toast.error("Login failed");
    }
  };

  return (
    <div className="rounded-lg text-center pt-12 pb-100">
      <h2 className="text-7xl font-semibold text-[#515456] mb-20">Sign in</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid">
        <p className="text-red-500 text-2xl text-left">
          {errors.email?.message}
        </p>
        <input
          type="email"
          placeholder="Email"
          className="border shadow rounded-xl py-8 mb-8 text-4xl placeholder:text-4xl px-5 placeholder:px-5 placeholder:text-gray-400 bg-white"
          {...register("email")}
        />

        <p className="text-red-500 text-2xl text-left">
          {errors.password?.message}
        </p>
        <div className="relative">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            className="border shadow rounded-xl py-8 mb-8 text-4xl placeholder:text-4xl px-5 placeholder:px-5 placeholder:text-gray-400 bg-white"
            {...register("password")}
          />
          <div
            className="absolute right-8 top-6 cursor-pointer"
            onClick={() => setPasswordVisible((v) => !v)}
          >
            {passwordVisible ? (
              <IoMdEyeOff className="text-6xl invert-50" />
            ) : (
              <IoMdEye className="text-6xl invert-50" />
            )}
          </div>
        </div>

        <Button content="Sign In" type="submit" className="w-full text-3xl " />

        <div className="mt-5">
          <Link to="/forgot-password" className="text-[#515456] text-4xl">
            Forgot password?
          </Link>
        </div>
      </form>

      <div className="flex justify-center items-center gap-2 mt-8">
        <p className="text-[#515456] text-4xl">Don't have an account? </p>
        <Link to="/signup" className="text-[#515456] text-4xl font-semibold">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
