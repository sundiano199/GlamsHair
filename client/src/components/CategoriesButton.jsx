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
   <div className="my-[-45px]">
    
   </div>
  );
};

export default CategoriesButton;
