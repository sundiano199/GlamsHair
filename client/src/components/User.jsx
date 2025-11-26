import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const User = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fullName = user?.fullName ?? "";
  const cleaned = fullName.trim();
  let displayName = "User";
  if (cleaned) {
    const parts = cleaned.split(/\s+/);
    displayName = parts.length > 1 ? parts[1] : parts[0];
  }
  
  return (
    <div>
      {user ? (
        <div className="flex gap-5 items-center  border-2 border-gray-400 rounded-lg p-2 mt-15 ">
          <FaUserAlt size={30} />
          <div>
            <h1 className="text-3xl  font-semibold">{displayName}</h1>
            <p className="text-lg">iamdyclef@gmail.com</p>
          </div>
        </div>
      ) : (
        <div className="border-2 border-gray-400 rounded-lg p-2 mt-15">
          <h1 className="text-3xl  font-semibold">Welcome Guest</h1>
          <h1 className="text-lg"> Already a GlamsQueen? </h1>

          <div className="">
            <button
              onClick={() => navigate("/signin")}
              className="font-semibold text-[#cc7c66]"
            >
              Login
            </button>{" "}
            <span> or </span>
            <button
              onClick={() => navigate("/signup")}
              className="font-semibold text-[#cc7c66] "
            >
              Sign up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
