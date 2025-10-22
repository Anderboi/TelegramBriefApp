import React from "react";

const BottomButtonBlock = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed bottom-2 left-2 right-2 rounded-2xl p-4 bg-white/90 dark:bg-black/90   flex justify-between gap-4 sm:static sm:border-t-0 sm:shadow-none sm:bg-transparent sm:pt-4">
      {children}
    </div>
  );
};

export default BottomButtonBlock;
