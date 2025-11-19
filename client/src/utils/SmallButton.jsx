import React from "react";

const SmallButton = ({ content, className }) => {
  return (
    <div>
      <button
        type="button"
        className={`rounded-xl p-2 bg-[#CC7C66] text-white  font-extrabold cursor-pointer ${className} }`}
      >
        {content}
      </button>
    </div>
  );
};

export default SmallButton;
