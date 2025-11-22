// src/utils/SmallButton.jsx
import React from "react";

/**
 * SmallButton
 * Props:
 *  - content: string (label)
 *  - onClick: function
 *  - active: boolean (applies active styles)
 *  - className: optional extra classes
 *  - type: button | submit
 */
const SmallButton = ({
  content,
  onClick,
  active = false,
  className = "",
  type = "button",
}) => {
  // base visual style (keeps small, neat, and consistent with your UI)
  const base =
    "px-4 py-2 rounded-lg border text-lg font-medium transition-transform transition-shadow duration-150 ease-out";

  // active style: filled accent, white text, slight scale and soft shadow + ring
  const activeClasses =
    "bg-[#cc7c66] text-white border-[#cc7c66] shadow-lg transform scale-105 ring-2 ring-[#cc7c66]/30";

  // inactive style: white bg, muted border, subtle hover lift
  const inactiveClasses =
    "bg-white font-bold text-gray-800 border-gray-300 hover:shadow-md hover:translate-y-0.5";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${
        active ? activeClasses : inactiveClasses
      } ${className}`}
      aria-pressed={active}
    >
      {content}
    </button>
  );
};

export default SmallButton;
