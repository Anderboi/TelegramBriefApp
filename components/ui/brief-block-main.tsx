import React from "react";

const BriefBlockMain = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <div className="space-y-6 pb-24">
      <h2 className="text-2xl font-bold">{title}</h2>
      {children}
    </div>
  );
};

export default BriefBlockMain;
