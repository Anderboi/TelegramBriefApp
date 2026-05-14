"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings2, Trash2 } from "lucide-react";

import { useBriefStore } from "@/lib/store/briefStore";
import { cn } from "@/lib/utils";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  ENGINEERING_OPTIONS,
  EngineeringSystemsSchema,
  EngineeringSystemsType,
} from "@/lib/schemas";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BriefBlockMain from "@/components/ui/brief-block-main";
import BottomButtonBlock from "@/components/ui/bottom-button-block";
import AddButton from "@/components/add-button";
import { ResponsivePanel } from '@/components/responsive-panel';

interface EngineeringFormProps {
  onNext: () => void;
  onBack: () => void;
}

type CategoryKey = keyof EngineeringSystemsType;

// Добавлен optionKey для связи со справочником ENGINEERING_OPTIONS
const categories: {
  key: CategoryKey;
  label: string;
  placeholder: string;
  optionKey: keyof typeof ENGINEERING_OPTIONS;
}[] = [
  {
    key: "heatingSystem",
    label: "Системы отопления",
    placeholder: "Например: Внутрипольные конвекторы",
    optionKey: "heating",
  },
  {
    key: "warmFloorRooms",
    label: "Теплые полы",
    placeholder: "Например: Электрический мат",
    optionKey: "warmFloor",
  },
  {
    key: "conditioningSystem",
    label: "Кондиционирование и вентиляция",
    placeholder: "Например: Канальный кондиционер",
    optionKey: "conditioning",
  },
  {
    key: "purificationSystem",
    label: "Водоочистка и водоснабжение",
    placeholder: "Например: Система обратного осмоса",
    optionKey: "purification",
  },
  {
    key: "electricSystem",
    label: "Электрооборудование и Умный дом",
    placeholder: "Например: Электрокарнизы",
    optionKey: "electric",
  },
];

interface EditingState {
  category: CategoryKey;
  id: number;
  system: string;
  rooms: string[];
  isNew: boolean;
}

export default function EngineeringBlock({
  onBack,
  onNext,
}: EngineeringFormProps) {
  const { engineeringData, setEngineeringData, premisesData } = useBriefStore();
  const availableRooms = premisesData?.rooms || [];

  const form = useForm<EngineeringSystemsType>({
    resolver: zodResolver(EngineeringSystemsSchema),
    defaultValues: engineeringData || {},
    mode: "onChange",
  });

  const [editing, setEditing] = useState<EditingState | null>(null);

  const handleAddNew = (category: CategoryKey) => {
    setEditing({
      category,
      id: Date.now(),
      system: "",
      rooms: [],
      isNew: true,
    });
  };

  const handleEdit = (category: CategoryKey, item: any) => {
    setEditing({
      category,
      id: item.id,
      system: item.system,
      rooms: [...item.rooms],
      isNew: false,
    });
  };

  const handleDelete = (category: CategoryKey, id: number) => {
    const currentItems = form.getValues(category) || [];
    form.setValue(
      category,
      currentItems.filter((item: any) => item.id !== id),
      { shouldDirty: true },
    );
  };

  const saveDrawer = () => {
    if (!editing || !editing.system.trim()) return;

    const currentItems = form.getValues(editing.category) || [];

    if (editing.isNew) {
      form.setValue(editing.category, [
        ...currentItems,
        { id: editing.id, system: editing.system.trim(), rooms: editing.rooms },
      ]);
    } else {
      form.setValue(
        editing.category,
        currentItems.map((item) =>
          item.id === editing.id
            ? { ...item, system: editing.system.trim(), rooms: editing.rooms }
            : item,
        ),
      );
    }
    setEditing(null);
  };

  const toggleRoom = (roomName: string) => {
    if (!editing) return;
    const isSelected = editing.rooms.includes(roomName);
    const newRooms = isSelected
      ? editing.rooms.filter((r) => r !== roomName)
      : [...editing.rooms, roomName];
    setEditing({ ...editing, rooms: newRooms });
  };

  const isAllSelected =
    editing?.rooms.length === availableRooms.length &&
    availableRooms.length > 0;

  const toggleAllRooms = () => {
    if (!editing) return;
    setEditing({
      ...editing,
      rooms: isAllSelected ? [] : availableRooms.map((r) => r.name),
    });
  };

  const onSubmit = (data: EngineeringSystemsType) => {
    setEngineeringData(data);
    onNext();
  };

  // Получаем опции для текущей открытой категории в шторке
  const currentCategoryObj = categories.find(
    (c) => c.key === editing?.category,
  );
  const currentTemplates = currentCategoryObj
    ? ENGINEERING_OPTIONS[currentCategoryObj.optionKey]
    : [];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 flex w-full flex-col"
      >
        <BriefBlockMain title="Инженерные системы">
          {availableRooms.length === 0 ? (
            <div className="p-6 text-center bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm text-amber-800">
                Сначала добавьте помещения в разделе «Состав помещений»
              </p>
            </div>
          ) : (
            <Accordion type="multiple" className="w-full space-y-2">
              {categories.map((cat) => {
                const currentItems = form.watch(cat.key) || [];

                return (
                  <AccordionItem
                    value={cat.key}
                    key={cat.key}
                    className="rounded-2xl px-4 shadow-lg bg-card"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-semibold text-left">
                          {cat.label}
                        </span>
                        {currentItems.length > 0 && (
                          <span className="text-xs bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full ml-2">
                            {currentItems.length}
                          </span>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4">
                      {/* Список добавленных систем */}
                      {currentItems.length > 0 && (
                        <div className="space-y-2">
                          {currentItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-start justify-between p-3 rounded-xl bg-secondary/20 border gap-3"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">
                                  {item.system}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 leading-snug">
                                  {item.rooms.length > 0
                                    ? item.rooms.join(", ")
                                    : "Помещения не выбраны"}
                                </p>
                              </div>
                              <div className="flex shrink-0 gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                                  onClick={() => handleEdit(cat.key, item)}
                                >
                                  <Settings2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleDelete(cat.key, item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <AddButton onClick={() => handleAddNew(cat.key)}>
                        Добавить систему
                      </AddButton>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}

          <ResponsivePanel
            title={
              editing?.isNew ? "Добавление системы" : "Редактирование системы"
            }
            open={!!editing}
            onClose={saveDrawer}
            onOpenChange={(open) => !open && setEditing(null)}
          >
            <div className="p-4 pb-0 space-y-6 overflow-y-auto">
              {/* Название системы с подсказками */}
              <div className="space-y-3">
                <Label htmlFor="system-name">
                  Название оборудования/системы
                </Label>
                <Input
                  id="system-name"
                  placeholder={currentCategoryObj?.placeholder}
                  value={editing?.system || ""}
                  onChange={(e) =>
                    editing &&
                    setEditing({ ...editing, system: e.target.value })
                  }
                  className="min-h-[44px]"
                />

                {/* Быстрые шаблоны из ENGINEERING_OPTIONS */}
                {currentTemplates.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentTemplates.map((template) => (
                      <Button
                        key={template}
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="text-xs h-7 rounded-full"
                        onClick={() =>
                          editing &&
                          setEditing({ ...editing, system: template })
                        }
                      >
                        {template}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Выбор помещений */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Привязка к помещениям</Label>
                  <Button
                    type="button"
                    variant={isAllSelected ? "secondary" : "ghost"}
                    size="sm"
                    onClick={toggleAllRooms}
                    disabled={availableRooms.length === 0}
                    className={cn(
                      "h-8 text-xs px-2",
                      isAllSelected && "opacity-70",
                    )}
                  >
                    {isAllSelected ? "Снять все" : "Выбрать все"}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {availableRooms.map((room) => {
                    const isSelected = editing?.rooms.includes(room.name);
                    return (
                      <Button
                        key={room.name}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        className="rounded-xl min-h-[36px] px-3 transition-colors text-sm"
                        onClick={() => toggleRoom(room.name)}
                      >
                        {room.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </ResponsivePanel>
          
        </BriefBlockMain>
        <BottomButtonBlock onBack={onBack} />
      </form>
    </Form>
  );
}
