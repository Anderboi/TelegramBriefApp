import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Button } from "./ui/button";

interface ResponsivePanelProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  title: string;
  isSaveDisabled?: boolean;
  footer?: boolean
}
export function ResponsivePanel({
  children,
  onClose,
  open,
  onOpenChange,
  title,
  isSaveDisabled,
  footer=true
}: ResponsivePanelProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="sm:max-w-[400px] bg-slate-50">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          {children}
          {footer && (
            <SheetFooter>
              <SheetClose asChild>
                <Button className="w-full //mb-20" onClick={onClose}>
                  Сохранить и закрыть
                </Button>
              </SheetClose>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        {children}
        {footer && <DrawerFooter>
          <DrawerClose asChild>
            <Button
              className="w-full mb-20"
              onClick={onClose}
              disabled={isSaveDisabled}
            >
              Сохранить и закрыть
            </Button>
          </DrawerClose>
        </DrawerFooter>}
      </DrawerContent>
    </Drawer>
  );
}
