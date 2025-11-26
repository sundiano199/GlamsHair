import React, { useState } from "react";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CategoriesButton = () => {
  

  return (
    <DropdownMenu className="relative" >
      
      <DropdownMenuTrigger className="flex gap-3 items-center bg-[#fce0d3]   rounded  focus:outline-none focus:ring-0 ">
        <BiSolidCategoryAlt size={30} />
        <span className="text-3xl font-semibold">Categories</span>
        <MdKeyboardArrowDown
          size={30}
          className="ml-10"
          
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        forceMount
        className="absolute top-56 left-35 bg-[#fce0d3]  border border-gray-400 rounded shadow-lg"
      >
        <DropdownMenuItem className="hover:bg-[#cc7c66]! text-md hover:text-white! text-md">
          All
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-[#cc7c66]! text-md hover:text-white! text-md">
          Bone Straight
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-[#cc7c66]! text-md hover:text-white! text-md">
          Bouncy Wigs
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-[#cc7c66]! text-md hover:text-white! text-md">
          Curly Wigs
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-[#cc7c66]! text-md hover:text-white! text-md">
          Long Wigs
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-[#cc7c66]! text-md hover:text-white! text-md">
          Short Wigs
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-[#cc7c66]! text-md hover:text-white! text-md">
          Straight Wigs
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoriesButton;
