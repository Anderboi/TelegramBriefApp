import React from "react";

const AnimatedArea = ({ children, formWatch }: any) => {
  return (
    <div
      className={`grid transition-all duration-300 ease-in-out ${
        formWatch
          ? "grid-rows-[1fr] opacity-100 mt-4"
          : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
};

export default AnimatedArea;
