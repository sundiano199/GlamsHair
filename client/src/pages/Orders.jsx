import NavBar from "@/components/NavBar";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";


const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate()
  return (
    <div className="">
      <NavBar />
      {user ? (
        <div>
          <h1 className="text-center text-2xl mt-5 py-2 mb-4 border-y-4  border-gray-400">
            My Orders
          </h1>
          <div className="overflow-x-auto mx-8 h-full w-full ">
            <table className="table table-xs table-pin-rows table-pin-cols ">
              <thead className="">
                <tr className="bg-[#FFFBF7]">
                  <th></th>
                  <td>Product Name</td>
                  <td>Lenght</td>
                  <td>Price</td>
                  <td>Date</td>
                  <td>Delivery Address</td>
                  <td>Payment status</td>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {/* <tr key={index}> */}
                <tr>
                  {/* <th>{index + 1}</th> */}
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
      ) : null
        
      }
    </div>
  );
};

export default Orders;
