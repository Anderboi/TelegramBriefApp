"use client";

import { memo, useCallback } from "react";
import { Equipment } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EquipmentRowProps {
  equipment: Equipment;
  onUpdate: <K extends keyof Equipment>(field: K, value: Equipment[K]) => void;
  onRemove: () => void;
  onEditDetails: () => void;
}

export const EquipmentRow = memo(function EquipmentRow({
  equipment,
  onUpdate,
  onRemove,
  onEditDetails,
}: EquipmentRowProps) {
  const hasExtraDetails = !!(
    equipment.manufacturer ||
    equipment.url ||
    equipment.description
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onUpdate("name", e.target.value),
    [onUpdate],
  );

  const handleQuantityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onUpdate("quantity", parseInt(e.target.value) || 1),
    [onUpdate],
  );

  return (
    <div className="flex items-center gap-1 bg-zinc-100 rounded-lg p-1.5">
      <Input
        value={equipment.name}
        onChange={handleNameChange}
        placeholder="Название"
        className="flex-1 h-9 px-1 border-none shadow-none focus-visible:ring-1 bg-transparent"
        aria-label="Название оборудования"
      />

      <Input
        type="number"
        value={equipment.quantity ?? 1}
        inputMode="numeric"
        onFocus={(e) => e.target.select()}
        onChange={handleQuantityChange}
        min={1}
        max={99}
        className="w-[52px] h-9 text-center bg-gray-50 border-gray-200 //px-1"
        aria-label="Количество"
      />

      <Button
        type="button"
        variant={hasExtraDetails ? "secondary" : "ghost"}
        size="icon"
        className={cn(
          "h-9 w-9 shrink-0",
          hasExtraDetails
            ? "text-primary bg-primary/10 hover:bg-primary/20"
            : "text-gray-400",
        )}
        onClick={onEditDetails}
        aria-label="Детали оборудования"
      >
        <Settings2 size={18} />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
        onClick={onRemove}
        aria-label={`Удалить ${equipment.name}`}
      >
        <X size={18} />
      </Button>
    </div>
  );
});

EquipmentRow.displayName = "EquipmentRow";