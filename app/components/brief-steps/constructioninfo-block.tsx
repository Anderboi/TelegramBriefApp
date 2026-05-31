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

import { ConstructionInfoSchema, ConstructionFormValues } from "@/lib/schemas";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BriefBlockMain from "@/components/ui/brief-block-main";
import BottomButtonBlock from "@/components/ui/bottom-button-block";
import AddButton from "@/components/add-button";
import { ResponsivePanel } from "@/components/responsive-panel";
import GuideContent from "@/components/guide-content";

interface ConstructionFormProps {
  onNext: () => void;
  onBack: () => void;
}

type ConstructionCategory = keyof ConstructionFormValues;

const SECTIONS: {
  key: ConstructionCategory;
  label: string;
  templates: string[];
}[] = [
  {
    key: "floor",
    label: "Полы",
    templates: [
      "Керамогранит",
      "Натуральный камень",
      "Паркетная доска",
      "Инженерная доска",
      "Ламинат",
      "Кварцвинил",
      "Микроцемент",
      "Ковролин",
      "Наливной пол",
    ],
  },
  {
    key: "ceiling",
    label: "Потолки",
    templates: [
      "Гипсокартонный",
      "Натяжной",
      "Под покраску",
      "Реечный",
      "Бетон (Лофт)",
      "Подвесной",
    ],
  },
  {
    key: "walls",
    label: "Стены",
    templates: [
      "Покраска",
      "Обои",
      "Декоративная штукатурка",
      "Панели",
      "Микроцемент",
    ],
  },
];

interface EditingState {
  category: ConstructionCategory;
  index: number;
  type: string;
  material: string;
  rooms: string[];
  isNew: boolean;
}

export default function ConstructionInfoBlock({
  onBack,
  onNext,
}: ConstructionFormProps) {
  const { constructionData, setConstructionData, premisesData } =
    useBriefStore();
  const availableRooms = premisesData?.rooms || [];

  const form = useForm<ConstructionFormValues>({
    resolver: zodResolver(ConstructionInfoSchema),
    defaultValues: constructionData || { floor: [], ceiling: [], walls: [] },
    mode: "onChange",
  });

  type PanelState =
    | { mode: "edit"; data: EditingState }
    | { mode: "guide"; category: ConstructionCategory }
    | null;

  const [panelState, setPanelState] = useState<PanelState>(null);

  // Оставляем переменную editing, чтобы старая логика формы работала без изменений!
  const editing = panelState?.mode === "edit" ? panelState.data : null;

  // Переопределяем setEditing, чтобы старые обработчики (handleEdit, toggleRoom) работали
  const setEditing = (data: EditingState | null) => {
    if (data) {
      setPanelState({ mode: "edit", data });
    } else {
      setPanelState(null);
    }
  };

  // Функция открытия справочника с защитой от потери введенных данных
  const handleOpenGuide = (category: ConstructionCategory) => {
    if (
      editing &&
      (editing.material.trim() !== "" || editing.rooms.length > 0)
    ) {
      const confirm = window.confirm(
        "У вас есть несохраненные данные. Если вы откроете справочник, они будут удалены. Продолжить?",
      );
      if (!confirm) return;
    }
    setPanelState({ mode: "guide", category });
  };

  const handleAddNew = (category: ConstructionCategory) => {
    setEditing({
      category,
      index: -1,
      type: "",
      material: "",
      rooms: [],
      isNew: true,
    });
  };

  const handleEdit = (
    category: ConstructionCategory,
    index: number,
    item: any,
  ) => {
    setEditing({
      category,
      index,
      type: item.type || "",
      material: item.material || "",
      rooms: [...(item.rooms || [])],
      isNew: false,
    });
  };

  const handleDelete = (category: ConstructionCategory, index: number) => {
    const current = form.getValues(category) || [];
    form.setValue(
      category,
      current.filter((_, i) => i !== index),
      { shouldDirty: true },
    );
  };

  const saveDrawer = () => {
    if (!editing) return;
    const currentItems = form.getValues(editing.category) || [];
    const newItem = {
      type: editing.type,
      material: editing.material.trim(),
      rooms: editing.rooms,
    };

    if (editing.isNew) {
      form.setValue(editing.category, [...currentItems, newItem]);
    } else {
      form.setValue(
        editing.category,
        currentItems.map((item, i) => (i === editing.index ? newItem : item)),
      );
    }
    setEditing(null);
  };

  const toggleRoom = (name: string) => {
    if (!editing) return;
    const rooms = editing.rooms.includes(name)
      ? editing.rooms.filter((r) => r !== name)
      : [...editing.rooms, name];
    setEditing({ ...editing, rooms });
  };

  // --- ЛОГИКА ДЛЯ ВЫБОРА ВСЕХ КОМНАТ ---
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

  const handleGuideSelect = (materialTitle: string) => {
    // Если мы в справочнике, берем текущую категорию
    if (panelState?.mode !== "guide") return;

    // Переключаем панель в режим добавления с уже вписанным материалом!
    setPanelState({
      mode: "edit",
      data: {
        category: panelState.category,
        index: -1,
        type: "",
        material: materialTitle,
        rooms: [], // Комнаты он докликает сам
        isNew: true,
      },
    });
  };

  const onSubmit = (data: ConstructionFormValues) => {
    setConstructionData(data);
    onNext();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 flex w-full flex-col"
      >
        <BriefBlockMain title="Информация по монтажу">
          {availableRooms.length === 0 ? (
            <div className="p-6 text-center bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm text-amber-800">
                Сначала добавьте помещения в разделе «Состав помещений»
              </p>
            </div>
          ) : (
            <Accordion type="multiple" className="w-full space-y-2">
              {SECTIONS.map((section) => {
                const items = form.watch(section.key) || [];
                return (
                  <AccordionItem
                    value={section.key}
                    key={section.key}
                    className="rounded-3xl px-4 bg-card"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-semibold text-left">
                          {section.label}
                        </span>
                        {items.length > 0 && (
                          <span className="text-xs bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full ml-2">
                            {items.length}
                          </span>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4">
                      {items.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between p-3 rounded-xl bg-secondary/20 border gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {item.material || "Материал не указан"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 leading-snug">
                              {item.rooms?.length > 0
                                ? item.rooms.join(", ")
                                : "Помещения не выбраны"}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              onClick={() => handleEdit(section.key, idx, item)}
                            >
                              <Settings2 className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDelete(section.key, idx)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleOpenGuide(section.key)}
                        className="//rounded-xl border border-dashed bg-secondary/50 text-sm h-auto w-full"
                      >
                        📖 Помощь в выборе
                      </Button>

                      <AddButton onClick={() => handleAddNew(section.key)}>
                        Добавить отделку
                      </AddButton>

                      {/* <AddButton onClick={() => handleAddNew(section.key)}>
                        Добавить отделку
                      </AddButton> */}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
          <ResponsivePanel
            open={!!panelState}
            onOpenChange={(open) => !open && setPanelState(null)}
            onClose={() =>
              panelState?.mode === "edit" ? saveDrawer() : setPanelState(null)
            }
            title={
              panelState?.mode === "guide"
                ? "Справочник материалов"
                : editing?.isNew
                  ? "Новая отделка"
                  : "Редактирование отделки"
            }
          >
            {panelState?.mode === "guide" && (
              <GuideContent
                category={panelState.category}
                onSelect={handleGuideSelect}
              />
            )}
            {panelState?.mode === "edit" && editing && (
              <div className="p-4 space-y-6 overflow-y-auto">
                {/* Поле материала и шаблоны */}
                <div className="space-y-3">
                  <Label>Тип или материал отделки</Label>
                  <Input
                    placeholder="Напр: Ламинат Quick-Step"
                    value={editing?.material || ""}
                    onChange={(e) =>
                      editing &&
                      setEditing({ ...editing, material: e.target.value })
                    }
                    className="min-h-[44px]"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(() => {
                      const templates =
                        SECTIONS.find((s) => s.key === editing?.category)
                          ?.templates || [];
                      const currentMaterial = editing?.material?.trim() || "";

                      return templates.map((t) => {
                        const isSelected = currentMaterial === t;
                        if (currentMaterial !== "" && !isSelected) {
                          return null;
                        }
                        return (
                          <Button
                            key={t}
                            type="button"
                            variant={isSelected ? "default" : "secondary"}
                            size="sm"
                            className="text-xs h-7 rounded-full transition-all"
                            onClick={() =>
                              editing &&
                              setEditing({
                                ...editing,
                                material: isSelected ? "" : t,
                              })
                            }
                          >
                            {t}
                          </Button>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Блок выбора помещений с кнопкой "Выбрать все" */}
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
                    {availableRooms.map((room) => (
                      <Button
                        key={room.name}
                        type="button"
                        variant={
                          editing?.rooms.includes(room.name)
                            ? "default"
                            : "outline"
                        }
                        className="rounded-xl min-h-[36px] px-3 text-sm"
                        onClick={() => toggleRoom(room.name)}
                      >
                        {room.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ResponsivePanel>
        </BriefBlockMain>
        <BottomButtonBlock onBack={onBack} />
      </form>
    </Form>
  );
}
