"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import FormBlock from "@/components/ui/formblock";
import {
  EquipmentBlockFormValues,
  EquipmentBlockSchema,
  Equipment,
  getMemoizedEquipmentSuggestions,
} from "@/lib/schemas";
import { ChevronDown, ChevronUp, X, ChevronRight, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import BottomButtonBlock from "@/components/ui/bottom-button-block";
import BriefBlockMain from "@/components/ui/brief-block-main";
import { useBriefStore } from "@/lib/store/briefStore";

interface EquipmentBlockProps {
  onNext: (data?: any) => void;
  onBack: () => void;
}

const EquipmentBlock: React.FC<EquipmentBlockProps> = ({ onNext, onBack }) => {
  const { equipmentData, setEquipmentData, premisesData } = useBriefStore();

  const [editingItem, setEditingItem] = useState<{
    roomId: string;
    equipmentId: string;
  } | null>(null);

  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());
  const [expandedEquipment, setExpandedEquipment] = useState<Set<string>>(
    new Set(),
  );

  const [roomsEquipment, setRoomsEquipment] = useState<{
    [roomId: string]: Equipment[];
  }>(() => {
    if (equipmentData && equipmentData.rooms.length > 0) {
      const equipmentMap: { [roomId: string]: Equipment[] } = {};
      equipmentData.rooms.forEach((room: any) => {
        equipmentMap[room.room_id] = room.equipment || [];
      });
      return equipmentMap;
    }

    if (premisesData && premisesData.rooms) {
      const initialEquipment: { [roomId: string]: Equipment[] } = {};
      premisesData.rooms.forEach((room, index) => {
        initialEquipment[`room-${index}`] = [];
      });
      return initialEquipment;
    }

    return {};
  });

  // Get rooms from premises data
  const rooms = useMemo(() => {
    if (premisesData && premisesData.rooms) {
      return premisesData.rooms.map((room, index) => ({
        id: `room-${index}`,
        name: room.name,
        order: room.order,
        type: room.type,
      }));
    }
    return [];
  }, [premisesData]);

  const form = useForm<EquipmentBlockFormValues>({
    resolver: zodResolver(EquipmentBlockSchema),
    mode: "onBlur",
    defaultValues: equipmentData || {
      rooms: [],
    },
  });

  const toggleRoom = (roomId: string) => {
    setExpandedRooms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(roomId)) newSet.delete(roomId);
      else newSet.add(roomId);
      return newSet;
    });
  };

  const toggleEquipmentDetails = (equipmentId: string) => {
    setExpandedEquipment((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(equipmentId)) {
        newSet.delete(equipmentId);
      } else {
        newSet.add(equipmentId);
      }
      return newSet;
    });
  };

  const addEquipmentFromSuggestion = (
    roomId: string,
    name: string,
    category?: string,
  ) => {
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
      [roomId]: [...(prev[roomId] || []), newEquipment],
    }));
  };

  const removeEquipment = (roomId: string, equipmentId: string) => {
    setRoomsEquipment((prev) => ({
      ...prev,
      [roomId]: prev[roomId].filter((eq) => eq.id !== equipmentId),
    }));
  };

  const updateEquipment = (
    roomId: string,
    equipmentId: string,
    field: keyof Equipment,
    value: any,
  ) => {
    setRoomsEquipment((prev) => ({
      ...prev,
      [roomId]: prev[roomId].map((eq) =>
        eq.id === equipmentId ? { ...eq, [field]: value } : eq,
      ),
    }));
  };

  function onSubmit() {
    try {
      const data: EquipmentBlockFormValues = {
        rooms: rooms.map((room) => ({
          room_id: room.id,
          room_name: room.name,
          equipment: roomsEquipment[room.id] || [],
        })),
      };
      setEquipmentData(data);
      toast.success("Наполнение помещений сохранено");
      onNext();
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при попытке сохранения данных");
    }
  }

  const currentEditEq = editingItem
    ? roomsEquipment[editingItem.roomId]?.find(
        (eq) => eq.id === editingItem.equipmentId,
      )
    : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <BriefBlockMain title="Наполнение помещений">
          {rooms.map((room) => {
            const isExpanded = expandedRooms.has(room.id);
            const equipment = roomsEquipment[room.id] || [];

            // Мемоизируем вычисления, связанные с подбором оборудования
            const suggestions = useMemo(() => {
              const allSuggestions = getMemoizedEquipmentSuggestions(
                room.name,
                room.type,
              );
              const selectedNames = new Set(equipment.map((eq) => eq.name));
              // Фильтруем suggestions, убирая уже выбранные
              return allSuggestions.filter(
                (s: { name: string; category: string }) =>
                  !selectedNames.has(s.name),
              );
            }, [room.name, room.type, equipment]);

            return (
              <FormBlock key={room.id} title="">
                <div className="space-y-3">
                  {/* Room Header */}
                  <button
                    type="button"
                    onClick={() => toggleRoom(room.id)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{room.order}.</span>
                      <span className="font-bold">{room.name}</span>
                      {equipment.length > 0 && (
                        <span className="text-sm text-gray-500">
                          ({equipment.length})
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>

                  {/* Room Content */}
                  {isExpanded && (
                    <div className="space-y-4">
                      {/* Suggestions */}
                      {suggestions.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">
                            Предлагаемое оборудование:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {suggestions.map(
                              (
                                suggestion: { name: string; category: string },
                                idx: number,
                              ) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    addEquipmentFromSuggestion(
                                      room.id,
                                      suggestion.name,
                                      suggestion.category,
                                    );
                                  }}
                                  className="px-3 py-1.5 rounded-full text-sm transition-colors bg-white text-black border border-gray-300 hover:bg-gray-50"
                                >
                                  {suggestion.name}
                                </button>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {/* Custom Equipment Input */}
                      <Input
                        placeholder="Добавьте предмет ..."
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            e.currentTarget.value.trim()
                          ) {
                            e.preventDefault();
                            addEquipmentFromSuggestion(
                              room.id,
                              e.currentTarget.value.trim(),
                              "Другое",
                            );
                            e.currentTarget.value = "";
                          }
                        }}
                      />

                      {/* Selected Equipment List - Compact */}
                      {equipment.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            Выбранное оборудование:
                          </p>
                          {equipment.map((eq) => {
                            const hasExtraDetails = !!(
                              eq.manufacturer ||
                              eq.url ||
                              eq.description
                            );
                            // const isDetailsExpanded = expandedEquipment.has(
                            //   eq.id,
                            // );
                            return (
                              <div
                                key={eq.id}
                                className="flex items-center //gap-2 //bg-zinc-100 border border-gray-200 //shadow-sm rounded-lg py-1.5"
                              >
                                <Input
                                  value={eq.name}
                                  onChange={(e) =>
                                    updateEquipment(
                                      room.id,
                                      eq.id,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Название"
                                  className="flex-1 h-8 border-none shadow-none focus-visible:ring-1 bg-transparent"
                                />
                                <Input
                                  type="number"
                                  value={eq.quantity || 1}
                                  onChange={(e) =>
                                    updateEquipment(
                                      room.id,
                                      eq.id,
                                      "quantity",
                                      parseInt(e.target.value) || 1,
                                    )
                                  }
                                  min="1"
                                  className="w-[52px] h-9 text-center bg-gray-50 border-gray-200 px-1"
                                />

                                {/* Кнопка вызова шторки (Drawer) */}
                                <Button
                                  type="button"
                                  variant={
                                    hasExtraDetails ? "secondary" : "ghost"
                                  }
                                  size="icon"
                                  className={`h-9 w-9 shrink-0 ${
                                    hasExtraDetails
                                      ? "text-primary bg-primary/10 hover:bg-primary/20"
                                      : "text-gray-400"
                                  }`}
                                  onClick={() =>
                                    setEditingItem({
                                      roomId: room.id,
                                      equipmentId: eq.id,
                                    })
                                  }
                                >
                                  <Settings2 size={18} />
                                </Button>

                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                  onClick={() =>
                                    removeEquipment(room.id, eq.id)
                                  }
                                >
                                  <X size={18} />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </FormBlock>
            );
          })}
        </BriefBlockMain>

        {/* Шторка (Drawer) для деталей оборудования */}
        <Drawer
          open={!!editingItem}
          onOpenChange={(open) => {
            if (!open) setEditingItem(null);
          }}
        >
          <DrawerContent>
            <div className="mx-auto w-full max-w-md">
              <DrawerHeader>
                <DrawerTitle>
                  {currentEditEq?.name || "Детали предмета"}
                </DrawerTitle>
                <DrawerDescription>
                  Уточните производителя, ссылку на товар или оставьте
                  комментарий для дизайнера.
                </DrawerDescription>
              </DrawerHeader>

              <div className="p-4 space-y-4">
                {currentEditEq && editingItem && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Производитель / Бренд
                      </label>
                      <Input
                        value={currentEditEq.manufacturer || ""}
                        onChange={(e) =>
                          updateEquipment(
                            editingItem.roomId,
                            currentEditEq.id,
                            "manufacturer",
                            e.target.value,
                          )
                        }
                        placeholder="Например: IKEA, Bork, Samsung"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Ссылка на товар
                      </label>
                      <Input
                        value={currentEditEq.url || ""}
                        onChange={(e) =>
                          updateEquipment(
                            editingItem.roomId,
                            currentEditEq.id,
                            "url",
                            e.target.value,
                          )
                        }
                        placeholder="https://..."
                        type="url"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Комментарий</label>
                      <Textarea
                        value={currentEditEq.description || ""}
                        onChange={(e) =>
                          updateEquipment(
                            editingItem.roomId,
                            currentEditEq.id,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Особые пожелания по цвету, размеру, расположению..."
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </div>

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button className="w-full">Сохранить и закрыть</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>

        <BottomButtonBlock onBack={onBack} />
      </form>
    </Form>
  );
};

export default EquipmentBlock;
