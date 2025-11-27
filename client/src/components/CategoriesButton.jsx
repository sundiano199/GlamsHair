import React from "react";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const categoryMap = [
  { label: "All", slug: "all" },
  { label: "Bone Straight", slug: "bone-straight" },
  { label: "Bouncy Wigs", slug: "bouncy" },
  { label: "Braided Wigs", slug: "braided" },
  { label: "Curly Wigs", slug: "curly" },
  { label: "Long Wigs", slug: "long" },
  { label: "Short Wigs", slug: "short" },
  { label: "Straight Wigs", slug: "straight" },
];

const CategoriesButton = ({ onSelect }) => {
  const navigate = useNavigate();

  const handleClick = (slug) => {
    navigate(`/products?category=${slug}`);
    if (onSelect) onSelect(); // callback to close side menu if passed
  };

  return (
    <DropdownMenu className="relative">
      <DropdownMenuTrigger className="flex gap-3 items-center bg-[#fce0d3] rounded focus:outline-none focus:ring-0">
        <BiSolidCategoryAlt size={30} />
        <span className="text-3xl font-semibold">Categories</span>
        <MdKeyboardArrowDown size={30} className="ml-10" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        forceMount
        className="absolute top-56 left-35 bg-[#fce0d3] border border-gray-400 rounded shadow-lg"
      >
        {categoryMap.map((cat) => (
          <DropdownMenuItem
            key={cat.slug}
            className="hover:bg-[#cc7c66]! text-md hover:text-white! text-md"
            onClick={() => handleClick(cat.slug)}
          >
            {cat.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoriesButton;
