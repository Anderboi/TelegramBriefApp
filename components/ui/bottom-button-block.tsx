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
    <div className="fixed //z-[99999] z-2 bottom-4 left-4 right-4 sm:left-6 sm:right-6 sm:bottom-6 rounded-full sm:rounded-2xl p-4 shadow-2xl bg-background/20 backdrop-blur-md border-t dark:bg-black/90 flex justify-between gap-4">
      {onBack && (
        <Button
          variant="ghost"
          type="button"
          className="max-sm:rounded-full"
          onClick={onBack}
          disabled={false}
          size="lg"
        >
          <ChevronLeft className="size-5" />
          Назад
        </Button>
      )}
      <Button type="submit" size="lg" className="flex-1 max-sm:rounded-full">
        {submitText}
      </Button>
    </div>
  );
};

export default BottomButtonBlock;
