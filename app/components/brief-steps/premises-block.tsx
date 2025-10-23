"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { roomList } from "@/lib/templates";
import { PremisesFormValues, PremisesSchema, RoomType } from "@/lib/schemas";
import FormBlock from "@/components/ui/formblock";
import StyledSelect from "@/components/ui/styled-creatable-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BottomButtonBlock from "@/components/ui/bottom-button-block";
import BriefBlockMain from "@/components/ui/brief-block-main";

interface PremisesBlockProps {
  onNext: (data: PremisesFormValues) => void;
  onBack: () => void;
}

const roomTypes = [
  { value: "living", label: "Жилая", emoji: "🏠" },
  { value: "utility", label: "Хозяйственная", emoji: "🔧" },
  { value: "wet", label: "Мокрая зона", emoji: "💧" },
  { value: "technical", label: "Техническая", emoji: "⚙️" },
];

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
  const [options, setOptions] = useState(roomList);

  const form = useForm<PremisesFormValues>({
    resolver: zodResolver(PremisesSchema),
    defaultValues: {
      rooms: [{ name: "", order: 1, type: undefined }],
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

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("premisesData");
    if (savedData) {
      form.reset(JSON.parse(savedData));
    }
  }, [form]);

  // Auto-save on form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem("premisesData", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  function onSubmit(data: PremisesFormValues) {
    try {
      localStorage.setItem("premisesData", JSON.stringify(data));
      toast.success("Помещения сохранены");
      onNext(data);
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        
      >
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
                    <span className="px-4">{room.order}</span>
                    <FormField
                      control={form.control}
                      name={`rooms.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="relative w-full">
                          <FormControl>
                            <StyledSelect
                              placeholder="Помещение..."
                              options={options}
                              onChange={(val) =>
                                handleRoomNameChange(val, index)
                              }
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
                  {/* </div> */}

                  {/* Показываем тип помещения или селект для выбора */}
                  {/* {currentType && (
                    <div className="pl-14 flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Тип:{" "}
                        {roomTypes.find((t) => t.value === currentType)?.emoji}{" "}
                        {roomTypes.find((t) => t.value === currentType)?.label}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          form.setValue(`rooms.${index}.type`, undefined)
                        }
                        className="h-6 text-xs"
                      >
                        Изменить
                      </Button>
                    </div>
                  )}

                  {showTypeSelect && (
                    <FormField
                      control={form.control}
                      name={`rooms.${index}.type`}
                      render={({ field }) => (
                        <FormItem className="pl-14">
                          <FormLabel>Укажите тип помещения</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Выберите тип помещения" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roomTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <span className="flex items-center gap-2">
                                    <span>{type.emoji}</span>
                                    <span>{type.label}</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  )} */}
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
        <BottomButtonBlock>
          <Button
            variant={"secondary"}
            type="button"
            onClick={onBack}
            disabled={false}
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

export default PremisesBlock;
