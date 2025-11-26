import React, { useState } from "react";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Accept a callback to set the selected category in the parent
const CategoriesButton = ({ onSelectCategory }) => {
  const [open, setOpen] = useState(false);

  const categories = [
    { label: "All", value: "all" },
    { label: "Bone Straight", value: "bone-straight" },
    { label: "Bouncy Wigs", value: "bouncy" },
    { label: "Curly Wigs", value: "curly" },
    { label: "Long Wigs", value: "long" },
    { label: "Short Wigs", value: "short" },
    { label: "Straight Wigs", value: "straight" },
  ];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} className="relative">
      <DropdownMenuTrigger className="flex gap-3 items-center bg-[#fce0d3] rounded focus:outline-none focus:ring-0">
        <BiSolidCategoryAlt size={30} />
        <span className="text-3xl font-semibold">Categories</span>
        <MdKeyboardArrowDown
          size={30}
          className={`ml-10 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        forceMount
        className="absolute top-56 left-35 bg-[#fce0d3] border border-gray-400 rounded shadow-lg"
      >
        {categories.map((cat) => (
          <DropdownMenuItem
            key={cat.value}
            className="hover:bg-[#cc7c66]! text-md hover:text-white! text-md"
            onSelect={() => onSelectCategory(cat.value)}
          >
            {cat.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoriesButton;
