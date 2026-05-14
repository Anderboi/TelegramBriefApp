"use client";

import { memo } from "react";
import { Equipment } from "@/lib/schemas";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ResponsivePanel } from "./responsive-panel";

interface EquipmentDetailsDrawerProps {
  equipment: Equipment | null;
  onUpdate: <K extends keyof Equipment>(field: K, value: Equipment[K]) => void;
  onClose: () => void;
}

export const EquipmentDetailsDrawer = memo(function EquipmentDetailsDrawer({
  equipment,
  onUpdate,
  onClose,
}: EquipmentDetailsDrawerProps) {
  return (
    <ResponsivePanel
      onClose={onClose}
      open={!!equipment}
      onOpenChange={(open) => !open && onClose()}
      title="Детали предмета"
    >
      {equipment && (
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manufacturer">Производитель / Бренд</Label>
            <Input
              id="manufacturer"
              value={equipment.manufacturer ?? ""}
              onChange={(e) => onUpdate("manufacturer", e.target.value)}
              placeholder="Например: IKEA, Bork, Samsung"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Ссылка на товар</Label>
            <Input
              id="url"
              value={equipment.url ?? ""}
              onChange={(e) => onUpdate("url", e.target.value)}
              placeholder="https://..."
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Комментарий</Label>
            <Textarea
              id="description"
              value={equipment.description ?? ""}
              onChange={(e) => onUpdate("description", e.target.value)}
              placeholder="Особые пожелания по цвету, размеру, расположению..."
              rows={3}
            />
          </div>
        </div>
      )}
    </ResponsivePanel>
    
  );
});

EquipmentDetailsDrawer.displayName = "EquipmentDetailsDrawer";
