"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { roomList } from "@/lib/templates";
import { PremisesFormValues, PremisesSchema, RoomType } from "@/lib/schemas";
import FormBlock from "@/components/ui/formblock";
import StyledSelect from "@/components/ui/styled-creatable-select";
import BottomButtonBlock from "@/components/ui/bottom-button-block";
import BriefBlockMain from "@/components/ui/brief-block-main";
import { useBriefStore } from "@/lib/store/briefStore";

interface PremisesBlockProps {
  onNext: () => void;
  onBack: () => void;
}

// const roomTypes = [
//   { value: "living", label: "Жилая", emoji: "🏠" },
//   { value: "utility", label: "Хозяйственная", emoji: "🔧" },
//   { value: "wet", label: "Мокрая зона", emoji: "💧" },
//   { value: "technical", label: "Техническая", emoji: "⚙️" },
// ];

// Функция автоматического определения типа помещения
const autoDetectRoomType = (roomName: string): RoomType | undefined => {
  const name = roomName.toLowerCase().trim();

  // Жилые помещения
  if (
    name.includes("спальн") ||
    name.includes("гостин") ||
    name.includes("кабинет") ||
    name.includes("детск") ||
    name.includes("зал")
  ) {
    return "living";
  }

  // Мокрые зоны
  if (
    name.includes("кухн") ||
    name.includes("ванн") ||
    name.includes("санузел") ||
    name.includes("с/у") ||
    name.includes("сан") ||
    name.includes("туалет") ||
    name.includes("душ")
  ) {
    return "wet";
  }

  // Хозяйственные
  if (
    name.includes("гард") ||
    name.includes("клад") ||
    name.includes("постир") ||
    name.includes("кладов") ||
    name.includes("гардероб") ||
    name.includes("прачеч")
  ) {
    return "utility";
  }

  // Технические
  if (
    name.includes("котельн") ||
    name.includes("электрощит") ||
    name.includes("венткамер")
  ) {
    return "technical";
  }

  return undefined;
};

const PremisesBlock: React.FC<PremisesBlockProps> = ({ onNext, onBack }) => {
  const { premisesData, setPremisesData } = useBriefStore();

  const [options, setOptions] = useState(roomList);

  const form = useForm<PremisesFormValues>({
    resolver: zodResolver(PremisesSchema),
    mode: "onBlur",
    defaultValues: {
      rooms:
        premisesData && premisesData.rooms && premisesData.rooms.length > 0
          ? premisesData.rooms
          : [{ name: "", order: 1, type: undefined }],
    },
  });

  const {
    fields: roomFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "rooms",
  });

  function onSubmit(data: PremisesFormValues) {
    try {
      // Обновляем данные в store
      setPremisesData(data);
      toast.success("Помещения сохранены");
      onNext();
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при попытке сохранения данных");
    }
  }

  const handleCreateOption = (inputValue: string, index: number) => {
    const newOption = { label: inputValue, value: inputValue };
    setOptions((prev) => [...prev, newOption]);
    form.setValue(`rooms.${index}.name`, inputValue);

    // Автоматически определяем тип
    const detectedType = autoDetectRoomType(inputValue);
    if (detectedType) {
      form.setValue(`rooms.${index}.type`, detectedType);
    }
  };

  const handleRoomNameChange = (value: string | null, index: number) => {
    if (!value) return;

    form.setValue(`rooms.${index}.name`, value);

    // Автоматически определяем тип при изменении названия
    const detectedType = autoDetectRoomType(value);
    if (detectedType) {
      form.setValue(`rooms.${index}.type`, detectedType);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <BriefBlockMain title="Состав помещений">
          <FormBlock>
            {roomFields.map((room, index) => {
              const currentName = form.watch(`rooms.${index}.name`);
              const currentType = form.watch(`rooms.${index}.type`);
              const showTypeSelect = currentName && !currentType;

              return (
                <article
                  key={room.id}
                  className="flex items-center gap-2 pb-4 border-b last:border-b-0"
                >
                  {/* <div className="flex  items-center gap-2"> */}
                  <span className="px-2">{room.order}</span>
                  <FormField
                    control={form.control}
                    name={`rooms.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="relative w-full">
                        <FormControl>
                          <StyledSelect
                            placeholder="Помещение..."
                            options={options}
                            onChange={(val) => handleRoomNameChange(val, index)}
                            value={
                              options.find(
                                (option) => option.value === field.value
                              ) || null
                            }
                            onCreateOption={(inputValue) =>
                              handleCreateOption(inputValue, index)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant={"destructive"}
                    onClick={() => remove(index)}
                    size={"sm"}
                  >
                    <Trash2Icon size={20} />
                  </Button>
                </article>
              );
            })}
          </FormBlock>
          <FormBlock>
            <Button
              type="button"
              variant="default"
              className="w-full"
              onClick={() =>
                append({
                  name: "",
                  order: roomFields.length + 1,
                  type: undefined,
                })
              }
            >
              Добавить помещение
            </Button>
          </FormBlock>
        </BriefBlockMain>
        <BottomButtonBlock onBack={onBack} />
      </form>
    </Form>
  );
};

export default PremisesBlock;
