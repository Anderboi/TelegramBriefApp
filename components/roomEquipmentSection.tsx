"use client";

import { memo, useMemo, useRef, useCallback } from "react";
import { Equipment, RoomType } from "@/lib/schemas";
import { getMemoizedEquipmentSuggestions } from "@/lib/schemas";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { EquipmentRow } from './equipmentRow';

interface Room {
  id: string;
  name: string;
  order: number;
  type?: RoomType | string;
}

interface Suggestion {
  name: string;
  category: string;
}

interface RoomEquipmentSectionProps {
  room: Room;
  equipment: Equipment[];
  onAddEquipment: (name: string, category?: string) => void;
  onRemoveEquipment: (equipmentId: string) => void;
  onUpdateEquipment: <K extends keyof Equipment>(
    equipmentId: string,
    field: K,
    value: Equipment[K],
  ) => void;
  onEditDetails: (equipmentId: string) => void;
}

export const RoomEquipmentSection = memo(function RoomEquipmentSection({
  room,
  equipment,
  onAddEquipment,
  onRemoveEquipment,
  onUpdateEquipment,
  onEditDetails,
}: RoomEquipmentSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // useMemo теперь корректно на уровне компонента, не внутри map
  const suggestions = useMemo<Suggestion[]>(() => {
    const all = getMemoizedEquipmentSuggestions(room.name, room.type as RoomType);
    const selectedNames = new Set(equipment.map((eq) => eq.name));
    return all.filter((s: Suggestion) => !selectedNames.has(s.name));
  }, [room.name, room.type, equipment]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      const value = e.currentTarget.value.trim();
      if (!value) return;

      e.preventDefault();
      onAddEquipment(value, "Другое");
      // Сбрасываем через ref — не мутируем currentTarget напрямую
      if (inputRef.current) inputRef.current.value = "";
    },
    [onAddEquipment],
  );

  return (
    <AccordionItem
      value={room.id}
      className="rounded-2xl px-4 shadow-xl bg-card"
    >
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{room.order}.</span>
          <span className="font-semibold text-sm">{room.name}</span>
          {equipment.length > 0 && (
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              {equipment.length}
            </span>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="pt-2 pb-4 space-y-2">
        {/* Подсказки */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Предлагаемое:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.name}
                  type="button"
                  onClick={() =>
                    onAddEquipment(suggestion.name, suggestion.category)
                  }
                  className="px-3 py-1.5 rounded-full text-sm border border-gray-200 bg-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {suggestion.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ввод произвольного предмета */}
        <Input
          ref={inputRef}
          className='h-10'
          placeholder="Добавьте предмет..."
          onKeyDown={handleKeyDown}
        />

        {/* Список выбранного оборудования */}
        {equipment.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Выбрано:{" "}
              <span className="text-muted-foreground font-normal">
                {equipment.length} позиции
              </span>
            </p>
            {equipment.map((eq) => (
              <EquipmentRow
                key={eq.id}
                equipment={eq}
                onUpdate={(field, value) =>
                  onUpdateEquipment(eq.id, field, value)
                }
                onRemove={() => onRemoveEquipment(eq.id)}
                onEditDetails={() => onEditDetails(eq.id)}
              />
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
});

RoomEquipmentSection.displayName = "RoomEquipmentSection";