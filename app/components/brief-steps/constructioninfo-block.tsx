"use client";

import React, { useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import FormBlock from "@/components/ui/formblock";
import {
  ConstructionFormValues,
  ConstructionInfoSchema,
  PremisesFormValues,
} from "@/lib/schemas";
import { Trash2Icon } from "lucide-react";

// Material types for each category
const floorTypes = [
  "Керамогранит",
  "Ламинат",
  "Паркет",
  "Инженерная доска",
  "Линолеум",
  "Другое",
];
const ceilingTypes = [
  "Натяжной потолок",
  "Покраска",
  "Гипсокартонный потолок",
  "Другое",
];
const wallTypes = [
  "Покраска",
  "Обои",
  "Декоративная штукатурка",
  "Плитка",
  "Другое",
];

interface ConstructionBlockProps {
  onNext: (data: ConstructionFormValues) => void;
  onBack: () => void;
}

const ConstructionBlock: React.FC<ConstructionBlockProps> = ({
  onNext,
  onBack,
}) => {
  const form = useForm<ConstructionFormValues>({
    resolver: zodResolver(ConstructionInfoSchema),
    defaultValues: {
      floor: [{ type: "", material: "", rooms: [] }],
      ceiling: [{ type: "", material: "", rooms: [] }],
      walls: [{ type: "", material: "", rooms: [] }],
    },
  });

  const {
    fields: floorFields,
    append: appendFloor,
    remove: removeFloor,
  } = useFieldArray({
    control: form.control,
    name: "floor",
  });

  const {
    fields: ceilingFields,
    append: appendCeiling,
    remove: removeCeiling,
  } = useFieldArray({
    control: form.control,
    name: "ceiling",
  });

  const {
    fields: wallsFields,
    append: appendWalls,
    remove: removeWalls,
  } = useFieldArray({
    control: form.control,
    name: "walls",
  });

  // Get room list from premises data with unique IDs
  const roomList = useMemo(() => {
    const savedData = localStorage.getItem("premisesData");
    if (savedData) {
      const premisesData: PremisesFormValues = JSON.parse(savedData);
      return premisesData.rooms.map((room, index) => ({
        id: `room-${index}`,
        name: room.name,
        order: room.order,
      }));
    }
    return [];
  }, []);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("constructionData");
    if (savedData) {
      form.reset(JSON.parse(savedData));
    }
  }, [form]);

  // Auto-save on form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem("constructionData", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const toggleRoom = (
    category: "floor" | "ceiling" | "walls",
    sectionIndex: number,
    roomId: string
  ) => {
    const currentSections = form.getValues(category);
    const section = currentSections[sectionIndex];

    if (!section) return;

    const currentRooms = section.rooms || [];

    if (currentRooms.includes(roomId)) {
      section.rooms = currentRooms.filter((r) => r !== roomId);
    } else {
      section.rooms = [...currentRooms, roomId];
    }

    form.setValue(category, currentSections, { shouldValidate: true });
  };

  const selectAllRooms = (
    category: "floor" | "ceiling" | "walls",
    sectionIndex: number
  ) => {
    const currentSections = form.getValues(category);
    const section = currentSections[sectionIndex];

    if (!section) return;

    const allRoomIds = roomList.map((room) => room.id);
    section.rooms = allRoomIds;

    form.setValue(category, currentSections, { shouldValidate: true });
  };

  function onSubmit(data: ConstructionFormValues) {
    try {
      // Filter out empty sections
      const cleanedData = {
        floor:
          data.floor?.filter(
            (item) => item && item.type && item.rooms && item.rooms.length > 0
          ) || [],
        ceiling:
          data.ceiling?.filter(
            (item) => item && item.type && item.rooms && item.rooms.length > 0
          ) || [],
        walls:
          data.walls?.filter(
            (item) => item && item.type && item.rooms && item.rooms.length > 0
          ) || [],
      };

      localStorage.setItem("constructionData", JSON.stringify(cleanedData));
      toast.success("Информация по монтажу сохранена");
      onNext(cleanedData);
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при попытке сохранения данных");
    }
  }

  const renderMaterialSection = (
    category: "floor" | "ceiling" | "walls",
    title: string,
    types: string[],
    fields: any[],
    append: any,
    remove: any
  ) => {
    const sections = form.watch(category);

    return (
      <FormBlock title={title}>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 pb-4 border-b last:border-b-0"
          >
            <div className="flex gap-2 items-start">
              <FormField
                control={form.control}
                name={`${category}.${index}.type` as any}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {types.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2Icon size={20} />
                </Button>
              )}
            </div>

            {sections[index]?.type === "Другое" && (
              <FormField
                control={form.control}
                name={`${category}.${index}.material` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Укажите материал"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Помещения:</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => selectAllRooms(category, index)}
                  className="text-xs h-7"
                >
                  Все комнаты
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {roomList.map((room) => {
                  const isSelected =
                    sections[index]?.rooms?.includes(room.id) || false;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => toggleRoom(category, index, room.id)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        isSelected
                          ? "bg-black text-white"
                          : "bg-white text-black border border-gray-300"
                      }`}
                    >
                      <span className="opacity-60 mr-1">{room.order}.</span>
                      {room.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {form.formState.errors[category]?.[index]?.rooms && (
              <p className="text-sm text-red-500">
                Выберите хотя бы одно помещение
              </p>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ type: "", material: "", rooms: [] })}
          className="w-full"
        >
          Добавить материал
        </Button>
      </FormBlock>
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full sm:w-full w-[calc(100vw-40px)] flex-col justify-between"
      >
        <div className="space-y-6 pb-8">
          <h2 className="text-2xl font-bold">Информация по монтажу</h2>

          {renderMaterialSection(
            "walls",
            "Стены",
            wallTypes,
            wallsFields,
            appendWalls,
            removeWalls
          )}
          {renderMaterialSection(
            "ceiling",
            "Потолок",
            ceilingTypes,
            ceilingFields,
            appendCeiling,
            removeCeiling
          )}
          {renderMaterialSection(
            "floor",
            "Напольные покрытия",
            floorTypes,
            floorFields,
            appendFloor,
            removeFloor
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="secondary" type="button" onClick={onBack}>
            Назад
          </Button>
          <Button type="submit">Далее</Button>
        </div>
      </form>
    </Form>
  );
};

export default ConstructionBlock;
