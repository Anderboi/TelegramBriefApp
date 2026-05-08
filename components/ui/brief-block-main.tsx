import React from "react";

const BriefBlockMain = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <div className="space-y-2 md:space-y-4">
      <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
      {children}
    </div>
  );
};

export default BriefBlockMain;
