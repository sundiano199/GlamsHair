import React from "react";
import { CiLogout } from "react-icons/ci";
import { TbLogout2 } from "react-icons/tb";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LogoutButton = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    toast.success("See you soon GlamsQueen", { duration: 6000 });
    navigate("/signin");
  };

  return (
    <div>
      {user ? (
        <button
          onClick={handleLogout}
          className="flex gap-3 items-center px-3 py-2 bg-red-500 rounded-2xl w-40"
        >
          <TbLogout2 size={30} className="text-white font-semibold " />
          <span className=" text-white text-2xl ">Logout</span>
        </button>
      ) : null}{" "}
      
    </div>
  );
};
export default LogoutButton;
