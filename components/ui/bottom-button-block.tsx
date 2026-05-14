import { Button } from "./button";
import { ChevronLeft } from 'lucide-react';

const BottomButtonBlock = ({
  onBack,
  submitText = "Далее",
}: {
  onBack?: () => void;
  submitText?: string;
}) => {
  return (
    <div className="fixed //z-[99999] bottom-4 left-4 right-4 sm:left-6 sm:right-6 sm:bottom-6 rounded-2xl p-4 shadow-2xl bg-white dark:bg-black/90 flex justify-between gap-4">
      {onBack && (
        <Button variant="ghost" type="button" onClick={onBack} disabled={false}>
          <ChevronLeft className="size-5" />
          Назад
        </Button>
      )}
      <Button type="submit" className="flex-1">
        {submitText}
      </Button>
    </div>
  );
};

export default BottomButtonBlock;
