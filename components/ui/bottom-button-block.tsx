import React from "react";
import { Button } from "./button";

const BottomButtonBlock = ({
  onBack,
  submitText = "Далее",
}: {
  onBack?: () => void;
  submitText?: string;
}) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 rounded-2xl p-4 shadow-2xl bg-white dark:bg-black/90   flex justify-between gap-4 sm:static sm:border-t-0 sm:shadow-none sm:bg-transparent sm:pt-4">
      {onBack && (
        <Button variant="ghost" type="button" onClick={onBack} disabled={false}>
          Назад
        </Button>
      )}
      <Button type="submit" className="flex-1 sm:flex-none">
        {submitText}
      </Button>
    </div>
  );
};

export default BottomButtonBlock;
