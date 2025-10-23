import React from "react";

const BottomButtonBlock = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 rounded-2xl p-4 shadow-2xl bg-white dark:bg-black/90   flex justify-between gap-4 sm:static sm:border-t-0 sm:shadow-none sm:bg-transparent sm:pt-4">
      {children}
    </div>
  );
};

export default BottomButtonBlock;
