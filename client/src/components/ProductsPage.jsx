import React, { useState } from "react";
import CategoriesButton from "./CategoriesButton";
import FilterDropDown from "./FilterDropDown";

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="mx-10 mt-10">
      {/* Category filter button */}
      <div className="mb-6">
        <CategoriesButton onSelectCategory={setSelectedCategory} />
      </div>

      {/* FilterDropDown shows products for the selected category */}
      <FilterDropDown selectedCategory={selectedCategory} />
    </div>
  );
};

export default ProductsPage;
