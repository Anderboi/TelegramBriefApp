import { Button } from "./ui/button";
import { Trash2Icon } from "lucide-react";

interface RemoveIconButtonProps {
  onClick: () => void;
}
const RemoveIconButton = ({ onClick }: RemoveIconButtonProps) => {
  return (
    <Button
      type="button"
      variant={"ghost"}
      onClick={onClick}
      size={"icon"}
      className="text-gray-400 hover:text-red-500 hover:bg-red-50"
    >
      <Trash2Icon size={20} />
    </Button>
  );
};

export default RemoveIconButton;
