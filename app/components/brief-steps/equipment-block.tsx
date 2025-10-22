"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  PremisesFormValues,
  Equipment,
  getEquipmentSuggestions,
} from "@/lib/schemas";
import { ChevronDown, ChevronUp, X, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BottomButtonBlock from '@/components/ui/bottom-button-block';
import BriefBlockMain from '@/components/ui/brief-block-main';

interface EquipmentBlockProps {
  onNext: (data: EquipmentBlockFormValues) => void;
  onBack: () => void;
}

const EquipmentBlock: React.FC<EquipmentBlockProps> = ({ onNext, onBack }) => {
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());
  const [expandedEquipment, setExpandedEquipment] = useState<Set<string>>(
    new Set()
  );
  const [roomsEquipment, setRoomsEquipment] = useState<{
    [roomId: string]: Equipment[];
  }>({});

  // Get rooms from premises data
  const rooms = useMemo(() => {
    const savedData = localStorage.getItem("premisesData");
    if (savedData) {
      const premisesData: PremisesFormValues = JSON.parse(savedData);
      return premisesData.rooms.map((room, index) => ({
        id: `room-${index}`,
        name: room.name,
        order: room.order,
        type: room.type,
      }));
    }
    return [];
  }, []);

  const form = useForm<EquipmentBlockFormValues>({
    resolver: zodResolver(EquipmentBlockSchema),
    defaultValues: {
      rooms: [],
    },
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("equipmentData");
    if (savedData) {
      const data = JSON.parse(savedData);
      const equipmentMap: { [roomId: string]: Equipment[] } = {};

      data.rooms?.forEach((room: any) => {
        equipmentMap[room.room_id] = room.equipment || [];
      });

      setRoomsEquipment(equipmentMap);
    } else {
      // Initialize empty equipment for each room
      const initialEquipment: { [roomId: string]: Equipment[] } = {};
      rooms.forEach((room) => {
        initialEquipment[room.id] = [];
      });
      setRoomsEquipment(initialEquipment);
    }
  }, [rooms]);

  // Auto-save on changes
  useEffect(() => {
    const data = {
      rooms: rooms.map((room) => ({
        room_id: room.id,
        room_name: room.name,
        equipment: roomsEquipment[room.id] || [],
      })),
    };
    localStorage.setItem("equipmentData", JSON.stringify(data));
  }, [roomsEquipment, rooms]);

  const toggleRoom = (roomId: string) => {
    setExpandedRooms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(roomId)) {
        newSet.delete(roomId);
      } else {
        newSet.add(roomId);
      }
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
    category?: string
  ) => {
    const newEquipment: Equipment = {
      id: uuidv4(),
      name,
      room_id: roomId,
      category,
      isCustom: false,
    };

    setRoomsEquipment((prev) => {
      const updated = {
        ...prev,
        [roomId]: [...(prev[roomId] || []), newEquipment],
      };
      return updated;
    });
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
    value: any
  ) => {
    setRoomsEquipment((prev) => ({
      ...prev,
      [roomId]: prev[roomId].map((eq) =>
        eq.id === equipmentId ? { ...eq, [field]: value } : eq
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

      localStorage.setItem("equipmentData", JSON.stringify(data));
      toast.success("Наполнение помещений сохранено");
      onNext(data);
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при попытке сохранения данных");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full w-full  flex-col"
      >
        <BriefBlockMain title="Наполнение помещений">

          {rooms.map((room) => {
            const isExpanded = expandedRooms.has(room.id);
            const equipment = roomsEquipment[room.id] || [];
            const allSuggestions = getEquipmentSuggestions(
              room.name,
              room.type
            );
            const selectedNames = new Set(equipment.map((eq) => eq.name));
            // Фильтруем suggestions, убирая уже выбранные
            const suggestions = allSuggestions.filter(
              (s) => !selectedNames.has(s.name)
            );

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
                    <div className="space-y-4 pl-4">
                      {/* Suggestions */}
                      {suggestions.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">
                            Предлагаемое оборудование:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  addEquipmentFromSuggestion(
                                    room.id,
                                    suggestion.name,
                                    suggestion.category
                                  );
                                }}
                                className="px-3 py-1.5 rounded-full text-sm transition-colors bg-white text-black border border-gray-300 hover:bg-gray-50"
                              >
                                {suggestion.name}
                              </button>
                            ))}
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
                              "Другое"
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
                            const isDetailsExpanded = expandedEquipment.has(
                              eq.id
                            );
                            return (
                              <div
                                key={eq.id}
                                className="border rounded-lg p-3 space-y-2"
                              >
                                {/* Compact view */}
                                <div className="flex items-center gap-2">
                                  <Input
                                    value={eq.name}
                                    onChange={(e) =>
                                      updateEquipment(
                                        room.id,
                                        eq.id,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Название"
                                    className="flex-1"
                                  />
                                  <Input
                                    type="number"
                                    value={eq.quantity || 1}
                                    onChange={(e) =>
                                      updateEquipment(
                                        room.id,
                                        eq.id,
                                        "quantity",
                                        parseInt(e.target.value) || 1
                                      )
                                    }
                                    placeholder="Кол-во"
                                    min="1"
                                    className="w-20"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      toggleEquipmentDetails(eq.id)
                                    }
                                    className="px-2"
                                  >
                                    <ChevronRight
                                      size={16}
                                      className={`transition-transform ${
                                        isDetailsExpanded ? "rotate-90" : ""
                                      }`}
                                    />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeEquipment(room.id, eq.id)
                                    }
                                    className="px-2"
                                  >
                                    <X size={16} />
                                  </Button>
                                </div>

                                {/* Expandable details */}
                                {isDetailsExpanded && (
                                  <div className="space-y-2 pt-2 border-t">
                                    <Input
                                      value={eq.manufacturer || ""}
                                      onChange={(e) =>
                                        updateEquipment(
                                          room.id,
                                          eq.id,
                                          "manufacturer",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Производитель (необязательно)"
                                    />
                                    <Input
                                      value={eq.url || ""}
                                      onChange={(e) =>
                                        updateEquipment(
                                          room.id,
                                          eq.id,
                                          "url",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Ссылка на товар (необязательно)"
                                    />
                                    <Textarea
                                      value={eq.description || ""}
                                      onChange={(e) =>
                                        updateEquipment(
                                          room.id,
                                          eq.id,
                                          "description",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Комментарий (необязательно)"
                                      rows={2}
                                    />
                                  </div>
                                )}
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

        <BottomButtonBlock>
          <Button
            variant="secondary"
            type="button"
            onClick={onBack}
          >
            Назад
          </Button>
          <Button type="submit" className="flex-1 sm:flex-none">
            Далее
          </Button>
        </BottomButtonBlock>
      </form>
    </Form>
  );
};

export default EquipmentBlock;
