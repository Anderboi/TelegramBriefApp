import { Button } from "./ui/button";
import { Plus } from "lucide-react";

interface AddButtonProps {
  children: any;
  onClick: () => void;
}

const AddButton = ({ children, onClick }: AddButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full border-dashed border-2 border-gray-300 hover:bg-gray-50 hover:text-gray-900"
      onClick={onClick}
    >
      <Plus className="mr-2 size-4" /> {children}
    </Button>
  );
};

export default AddButton;
