// hooks/useRoomsEquipment.ts
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Equipment } from "@/lib/schemas";

type RoomsEquipmentMap = Record<string, Equipment[]>;

export function useRoomsEquipment(initialMap: RoomsEquipmentMap) {
  const [roomsEquipment, setRoomsEquipment] =
    useState<RoomsEquipmentMap>(initialMap);

  const addEquipment = useCallback(
    (roomId: string, name: string, category = "Другое") => {
      const newEquipment: Equipment = {
        id: uuidv4(),
        name,
        room_id: roomId,
        category,
        isCustom: false,
        quantity: 1,
      };
      setRoomsEquipment((prev) => ({
        ...prev,
        [roomId]: [...(prev[roomId] ?? []), newEquipment],
      }));
    },
    [],
  );

  const removeEquipment = useCallback((roomId: string, equipmentId: string) => {
    setRoomsEquipment((prev) => ({
      ...prev,
      [roomId]: prev[roomId].filter((eq) => eq.id !== equipmentId),
    }));
  }, []);

  // Типизированное обновление — value зависит от поля
  const updateEquipment = useCallback(
    <K extends keyof Equipment>(
      roomId: string,
      equipmentId: string,
      field: K,
      value: Equipment[K],
    ) => {
      setRoomsEquipment((prev) => ({
        ...prev,
        [roomId]: prev[roomId].map((eq) =>
          eq.id === equipmentId ? { ...eq, [field]: value } : eq,
        ),
      }));
    },
    [],
  );

  return { roomsEquipment, addEquipment, removeEquipment, updateEquipment };
}
