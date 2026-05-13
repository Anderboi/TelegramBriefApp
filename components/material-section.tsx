"use client";

import { memo, useCallback } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { ConstructionFormValues } from "@/lib/schemas";

import {
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
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ChevronDown, ChevronUp } from "lucide-react";
import FormBlock from "@/components/ui/formblock";
import AddButton from "@/components/add-button";
import RemoveIconButton from "@/components/remove-icon-button";
import { cn } from "@/lib/utils";
import { ConstructionCategory } from '@/lib/constants';
import { MaterialSectionItem } from './material-section-item';

interface Room {
  id: string;
  name: string;
  order: number;
}

interface MaterialSectionProps {
  category: ConstructionCategory;
  title: string;
  types: readonly string[];
  roomList: Room[];
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onToggleRoom: (sectionIndex: number, roomId: string) => void;
  onToggleAllRooms: (sectionIndex: number) => void;
}

export const MaterialSection = memo(function MaterialSection({
  category,
  title,
  types,
  roomList,
  isExpanded,
  onToggleExpanded,
  onToggleRoom,
  onToggleAllRooms,
}: MaterialSectionProps) {
  const form = useFormContext<ConstructionFormValues>();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: category,
  });

  // useWatch вместо form.watch — не вызывает ре-рендер всего родителя
  const sections = useWatch({ control: form.control, name: category }) ?? [];

  const itemCount = sections.filter(
    (s) => s?.type && s.rooms && s.rooms.length > 0,
  ).length;

  const handleAppend = useCallback(
    () => append({ type: "", material: "", rooms: [] }),
    [append],
  );

  return (
    <FormBlock>
      <div className="space-y-4">
        {/* Заголовок категории */}
        <button
          type="button"
          onClick={onToggleExpanded}
          className="flex items-center justify-between w-full text-left group"
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm group-hover:text-zinc-700 transition-colors">
              {title}
            </span>
            {itemCount > 0 && (
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {/* Контент */}
        {isExpanded && (
          <div className="space-y-4 animate-in slide-in-from-top-1 duration-150">
            {fields.map((field, index) => (
              <MaterialSectionItem
                key={field.id}
                category={category}
                index={index}
                types={types}
                roomList={roomList}
                selectedRooms={sections[index]?.rooms ?? []}
                selectedType={sections[index]?.type ?? ""}
                canRemove={fields.length > 1}
                onRemove={() => remove(index)}
                onToggleRoom={(roomId: string) => onToggleRoom(index, roomId)}
                onToggleAllRooms={() => onToggleAllRooms(index)}
              />
            ))}

            <AddButton onClick={handleAppend}>Добавить материал</AddButton>
          </div>
        )}
      </div>
    </FormBlock>
  );
});
