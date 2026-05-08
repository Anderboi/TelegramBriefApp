"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "sonner";
import { roomList } from "@/lib/templates";
import { PremisesFormValues, PremisesSchema, RoomType } from "@/lib/schemas";
import FormBlock from "@/components/ui/formblock";
import StyledSelect from "@/components/ui/styled-creatable-select";
import BottomButtonBlock from "@/components/ui/bottom-button-block";
import BriefBlockMain from "@/components/ui/brief-block-main";
import { useBriefStore } from "@/lib/store/briefStore";
import AddButton from "@/components/add-button";
import RemoveIconButton from "@/components/remove-icon-button";
import { GripVertical } from "lucide-react";

// DND-kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PremisesBlockProps {
  onNext: () => void;
  onBack: () => void;
}

// Функция автоматического определения типа помещения
const autoDetectRoomType = (roomName: string): RoomType | undefined => {
  const name = roomName.toLowerCase().trim();

  if (
    name.includes("спальн") ||
    name.includes("гостин") ||
    name.includes("кабинет") ||
    name.includes("детск") ||
    name.includes("зал")
  ) {
    return "living";
  }
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
  if (
    name.includes("котельн") ||
    name.includes("электрощит") ||
    name.includes("венткамер")
  ) {
    return "technical";
  }
  return undefined;
};

// Отдельный компонент для элемента с поддержкой Drag-and-Drop
interface SortableRoomItemProps {
  id: string;
  index: number;
  form: UseFormReturn<PremisesFormValues>;
  options: typeof roomList;
  handleRoomNameChange: (value: string | null, index: number) => void;
  handleCreateOption: (inputValue: string, index: number) => void;
  onRemove: () => void;
}

const SortableRoomItem: React.FC<SortableRoomItemProps> = ({
  id,
  index,
  form,
  options,
  handleRoomNameChange,
  handleCreateOption,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 pb-4 border-b last:border-b-0 bg-white relative ${
        isDragging ? "shadow-md rounded-lg p-2 border" : ""
      }`}
    >
      {/* Кнопка (грип) за которую тянем */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-300 hover:text-gray-500 touch-none"
      >
        <GripVertical size={20} />
      </div>

      {/* Выводим index + 1 вместо room.order для всегда правильной визуальной последовательности */}
      <span className="px-1 w-5 text-center text-sm font-medium">
        {index + 1}
      </span>

      <FormField
        control={form.control}
        name={`rooms.${index}.name`}
        render={({ field }) => (
          <FormItem className="relative w-full">
            <FormControl>
              <StyledSelect
                placeholder="Помещение..."
                options={options}
                onChange={(val: any) => handleRoomNameChange(val, index)}
                value={
                  options.find((option) => option.value === field.value) || null
                }
                onCreateOption={(inputValue: string) =>
                  handleCreateOption(inputValue, index)
                }
              />
            </FormControl>
          </FormItem>
        )}
      />
      <RemoveIconButton onClick={onRemove} />
    </article>
  );
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
    move, // Извлекаем встроенную функцию move из react-hook-form
  } = useFieldArray({
    control: form.control,
    name: "rooms",
  });

  // Настройка сенсоров для Drag-and-Drop (мышь + касания на телефоне)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Обработчик окончания перетаскивания
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = roomFields.findIndex((item) => item.id === active.id);
      const newIndex = roomFields.findIndex((item) => item.id === over.id);
      move(oldIndex, newIndex); // Автоматически меняет элементы местами в форме
    }
  };

  function onSubmit(data: PremisesFormValues) {
    try {
      // ПЕРЕСЧЕТ: Перезаписываем 'order' перед отправкой в стор,
      // чтобы после всех удалений и сортировок данные в базе были чистыми (1, 2, 3...)
      const normalizedData = {
        ...data,
        rooms: data.rooms.map((room, i) => ({
          ...room,
          order: i + 1,
        })),
      };

      setPremisesData(normalizedData);
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

    const detectedType = autoDetectRoomType(inputValue);
    if (detectedType) {
      form.setValue(`rooms.${index}.type`, detectedType);
    }
  };

  const handleRoomNameChange = (value: string | null, index: number) => {
    if (!value) return;
    form.setValue(`rooms.${index}.name`, value);

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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={roomFields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                {roomFields.map((room, index) => (
                  <SortableRoomItem
                    key={room.id}
                    id={room.id}
                    index={index}
                    form={form}
                    options={options}
                    handleRoomNameChange={handleRoomNameChange}
                    handleCreateOption={handleCreateOption}
                    onRemove={() => remove(index)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </FormBlock>

          <FormBlock>
            <AddButton
              onClick={() =>
                append({
                  name: "",
                  order: roomFields.length + 1,
                  type: undefined,
                })
              }
            >
              Добавить помещение
            </AddButton>
          </FormBlock>
        </BriefBlockMain>
        <BottomButtonBlock onBack={onBack} />
      </form>
    </Form>
  );
};

export default PremisesBlock;
