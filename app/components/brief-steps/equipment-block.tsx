"use client";

import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Accordion } from "@/components/ui/accordion";
import BriefBlockMain from "@/components/ui/brief-block-main";
import BottomButtonBlock from "@/components/ui/bottom-button-block";

import { EquipmentBlockFormValues, EquipmentBlockSchema, PremisesFormValues } from "@/lib/schemas";
import { useBriefStore } from "@/lib/store/briefStore";
import { useRoomsEquipment } from "@/lib/hooks/useRoomsEquipment";
import { RoomEquipmentSection } from "@/components/roomEquipmentSection";
import { EquipmentDetailsDrawer } from "@/components/equipmentDetailsDrawer";

// ─── Типы ────────────────────────────────────────────────────────────────────

interface EquipmentBlockProps {
  onNext: () => void;
  onBack: () => void;
}

// ─── Утилита инициализации состояния ─────────────────────────────────────────

function buildInitialEquipmentMap(
  equipmentData: EquipmentBlockFormValues | null | undefined,
  premisesData: PremisesFormValues | null | undefined,
) {
  if (equipmentData?.rooms?.length) {
    return Object.fromEntries(
      equipmentData.rooms.map(
        (room: EquipmentBlockFormValues["rooms"][number]) => [
          room.room_id,
          room.equipment ?? [],
        ],
      ),
    );
  }

  if (premisesData?.rooms?.length) {
    return Object.fromEntries(
      premisesData.rooms.map((_, index) => [`room-${index}`, []]),
    );
  }

  return {};
}

// ─── Компонент ───────────────────────────────────────────────────────────────

const EquipmentBlock: React.FC<EquipmentBlockProps> = ({ onNext, onBack }) => {
  const { equipmentData, setEquipmentData, premisesData } = useBriefStore();

  // Состояние редактируемого предмета: { roomId, equipmentId } | null
  const [editingItem, setEditingItem] = useState<{
    roomId: string;
    equipmentId: string;
  } | null>(null);

  // Список комнат из данных помещений
  const rooms = useMemo(
    () =>
      premisesData?.rooms?.map((room, index) => ({
        id: `room-${index}`,
        name: room.name,
        order: room.order,
        type: room.type,
      })) ?? [],
    [premisesData],
  );

  // Логика оборудования — в хуке
  const { roomsEquipment, addEquipment, removeEquipment, updateEquipment } =
    useRoomsEquipment(buildInitialEquipmentMap(equipmentData, premisesData));

  // Предмет который сейчас редактируется в Drawer
  const currentEditEq = useMemo(() => {
    if (!editingItem) return null;
    return (
      roomsEquipment[editingItem.roomId]?.find(
        (eq) => eq.id === editingItem.equipmentId,
      ) ?? null
    );
  }, [editingItem, roomsEquipment]);

  const form = useForm<EquipmentBlockFormValues>({
    resolver: zodResolver(EquipmentBlockSchema),
    defaultValues: equipmentData ?? { rooms: [] },
  });

  const onSubmit = useCallback(() => {
    try {
      const data: EquipmentBlockFormValues = {
        rooms: rooms.map((room) => ({
          room_id: room.id,
          room_name: room.name,
          equipment: roomsEquipment[room.id] ?? [],
        })),
      };
      setEquipmentData(data);
      toast.success("Наполнение помещений сохранено");
      onNext();
    } catch (error) {
      console.error("[EquipmentBlock] submit error:", error);
      toast.error("Ошибка при сохранении данных");
    }
  }, [rooms, roomsEquipment, setEquipmentData, onNext]);

  // ─── JSX ───────────────────────────────────────────────────────────────────

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <BriefBlockMain title="Наполнение помещений">
          {rooms.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Сначала заполните состав помещений
            </p>
          ) : (
            <Accordion type="multiple" className="w-full space-y-2">
              {rooms.map((room) => (
                <RoomEquipmentSection
                  key={room.id}
                  room={room}
                  equipment={roomsEquipment[room.id] ?? []}
                  onAddEquipment={(name, category) =>
                    addEquipment(room.id, name, category)
                  }
                  onRemoveEquipment={(equipmentId) =>
                    removeEquipment(room.id, equipmentId)
                  }
                  onUpdateEquipment={(equipmentId, field, value) =>
                    updateEquipment(room.id, equipmentId, field, value)
                  }
                  onEditDetails={(equipmentId) =>
                    setEditingItem({ roomId: room.id, equipmentId })
                  }
                />
              ))}
            </Accordion>
          )}
        </BriefBlockMain>

        {/* Drawer деталей оборудования */}
        <EquipmentDetailsDrawer
          equipment={currentEditEq}
          onUpdate={(field, value) => {
            if (!editingItem) return;
            updateEquipment(
              editingItem.roomId,
              editingItem.equipmentId,
              field,
              value,
            );
          }}
          onClose={() => setEditingItem(null)}
        />

        <BottomButtonBlock onBack={onBack} />
      </form>
    </Form>
  );
};

export default EquipmentBlock;
