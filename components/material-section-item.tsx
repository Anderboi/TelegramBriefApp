"use client";

import { memo } from "react";
import { useFormContext } from "react-hook-form";
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
import RemoveIconButton from "@/components/remove-icon-button";
import { cn } from "@/lib/utils";
import { ConstructionCategory, OTHER_TYPE } from '@/lib/constants';

interface Room {
  id: string;
  name: string;
  order: number;
}

interface MaterialSectionItemProps {
  category: ConstructionCategory;
  index: number;
  types: readonly string[];
  roomList: Room[];
  selectedRooms: string[];
  selectedType: string;
  canRemove: boolean;
  onRemove: () => void;
  onToggleRoom: (roomId: string) => void;
  onToggleAllRooms: () => void;
}

export const MaterialSectionItem = memo(function MaterialSectionItem({
  category,
  index,
  types,
  roomList,
  selectedRooms,
  selectedType,
  canRemove,
  onRemove,
  onToggleRoom,
  onToggleAllRooms,
}: MaterialSectionItemProps) {
  const form = useFormContext<ConstructionFormValues>();

  const allRoomIds = roomList.map((r) => r.id);
  const isAllSelected =
    allRoomIds.length > 0 && selectedRooms.length === allRoomIds.length;

  const hasRoomError = !!form.formState.errors[category]?.[index]?.rooms;

  return (
    <div className="space-y-4 pb-4 border-b last:border-b-0 last:pb-0">
      {/* Выбор типа материала */}
      <div className="flex gap-2 items-start">
        <FormField
          control={form.control}
          name={`${category}.${index}.type`}
          render={({ field }) => (
            <FormItem className="w-full">
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger className='w-full'>
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

        {canRemove && <RemoveIconButton onClick={onRemove} />}
      </div>

      {/* Поле для "Другое" */}
      {selectedType === OTHER_TYPE && (
        <FormField
          control={form.control}
          name={`${category}.${index}.material`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Укажите материал"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Выбор помещений */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Помещения:</span>
          {roomList.length > 0 && (
            <Button
              type="button"
              variant={'ghost'}
              onClick={onToggleAllRooms}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 rounded-full cursor-pointer"
            >
              {isAllSelected ? "Снять все" : `Выбрать все (${roomList.length})`}
            </Button>
          )}
        </div>

        {roomList.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Сначала добавьте помещения
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {roomList.map((room) => {
              const isSelected = selectedRooms.includes(room.id);
              return (
                <Toggle
                  key={room.id}
                  type="button"
                  pressed={isSelected}
                  onPressedChange={() => onToggleRoom(room.id)}
                  className={cn(
                    "transition-all rounded-full cursor-pointer",
                    isSelected
                      ? "bg-black text-white hover:bg-black/80 data-[state=on]:bg-black data-[state=on]:text-white"
                      : "bg-neutral-100 text-black border border-gray-200",
                  )}
                >
                  <span className="opacity-50 mr-1">{room.order}.</span>
                  {room.name}
                </Toggle>
              );
            })}
          </div>
        )}

        {hasRoomError && (
          <p className="text-sm text-destructive">
            Выберите хотя бы одно помещение
          </p>
        )}
      </div>
    </div>
  );
});
