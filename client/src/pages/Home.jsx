import React from "react";
import NavBar from "../components/NavBar";
import FilterDropdown from "../components/FilterDropDown";
import Search from "../components/Search";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
const Home = () => {
  const location = useLocation();
  return (
    <div>
      {/* <div className="fixed top-0 left-0 right-0 bg-[#FFFBF7]">
        <NavBar />
        
        <Search />
      </div> */}
      <FilterDropdown />
      <Outlet />
    </div>
  );
};

export default Home;
