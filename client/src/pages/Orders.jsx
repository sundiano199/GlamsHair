import NavBar from "@/components/NavBar";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until auth state is known
    if (!authLoading && !user) {
      toast.dismiss();
      toast.error("You have to sign in to view your orders", {
        duration: 10000,
      });
      navigate("/signin");
    }
  }, [user, authLoading, navigate]);

  if (!user) {
    // Optionally render nothing while redirecting
    return null;
  }

  return (
    <div className="">
      <NavBar />
      <div>
        <h1 className="text-center text-2xl mt-5 py-2 mb-4 border-y-4 border-gray-400">
          My Orders
        </h1>
        <div className="overflow-x-auto mx-8 h-full w-full ">
          <table className="table table-xs table-pin-rows table-pin-cols ">
            <thead className="">
              <tr className="bg-[#FFFBF7]">
                <th></th>
                <td>Product Name</td>
                <td>Length</td>
                <td>Price</td>
                <td>Date</td>
                <td>Delivery Address</td>
                <td>Payment status</td>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>1</th>
                <td>Cy Ganderton</td>
                <td>22</td>
                <td>10,000</td>
                <td>Canada</td>
                <td>12/16/2020</td>
                <td>Completed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
