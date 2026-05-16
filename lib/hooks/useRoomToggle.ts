import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { ConstructionFormValues } from "@/lib/schemas";
import { ConstructionCategory } from "../constants";

interface Room {
  id: string;
}

type SectionItem = {
  type: string;
  material: string;
  rooms: string[];
};

export function useRoomToggle(
  form: UseFormReturn<ConstructionFormValues>,
  roomList: Room[],
) {
  // Фикс: используем update из useFieldArray вместо прямой мутации
  const toggleRoom = useCallback(
    (category: ConstructionCategory, sectionIndex: number, roomId: string) => {
      const currentSections = (form.getValues(category) || []) as SectionItem[];
      const section = currentSections[sectionIndex];
      if (!section) return;

      const currentRooms = section.rooms ?? [];
      const nextRooms = currentRooms.includes(roomId)
        ? currentRooms.filter((r) => r !== roomId)
        : [...currentRooms, roomId];

      // Создаём новый массив — не мутируем
      const nextSections = currentSections.map((s, i) =>
        i === sectionIndex ? { ...s, rooms: nextRooms } : s,
      );

      form.setValue(category, nextSections, { shouldValidate: true });
    },
    [form],
  );

  const toggleAllRooms = useCallback(
    (category: ConstructionCategory, sectionIndex: number) => {
      const currentSections = form.getValues(category);
      const section = currentSections[sectionIndex];
      if (!section) return;

      const allRoomIds = roomList.map((r) => r.id);
      const currentRooms = section.rooms ?? [];
      const isAllSelected =
        allRoomIds.length > 0 && currentRooms.length === allRoomIds.length;

      const nextSections = currentSections.map((s, i) =>
        i === sectionIndex
          ? {
              ...s,
              type: s?.type || "",
              material: s?.material || "",
              rooms: isAllSelected ? [] : allRoomIds,
            }
          : s,
      );

      form.setValue(
        category,
        nextSections as ConstructionFormValues[typeof category],
        { shouldValidate: true },
      );
    },
    [form, roomList],
  );

  return { toggleRoom, toggleAllRooms };
}
