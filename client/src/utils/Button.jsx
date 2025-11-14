import React from "react";

const Button = ({ content, type, className }) => {
  return (
    <div>
      <button
        type={type}
        className={`rounded-xl py-10 bg-[#cc7c66] text-white font-medium cursor-pointer ${className}}`}
      >
        {content}
      </button>
    </div>
  );
};

export default Button;
