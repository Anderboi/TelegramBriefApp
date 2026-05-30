"use client";

import { useState, useMemo, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Settings2, Trash2, Plus, Minus } from "lucide-react";

import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import BriefBlockMain from "@/components/ui/brief-block-main";
import BottomButtonBlock from "@/components/ui/bottom-button-block";
import { ResponsivePanel } from "@/components/responsive-panel";

import { EquipmentBlockFormValues, EquipmentBlockSchema } from "@/lib/schemas";
import { useBriefStore } from "@/lib/store/briefStore";

// 1. Категории и умные шаблоны
const CATEGORIES = [
  "Мебель",
  "Техника",
  "Сантехника",
  "Освещение",
  "Декор",
  "Другое",
];

const QUICK_ADD_TEMPLATES = [
  { name: "Кровать", category: "Мебель" },
  { name: "Диван", category: "Мебель" },
  { name: "Шкаф", category: "Мебель" },
  { name: "Стол", category: "Мебель" },
  { name: "Стул", category: "Мебель" },
  { name: "Телевизор", category: "Техника" },
  { name: "Аккуст. сист.", category: "Техника" },
  { name: "Унитаз", category: "Сантехника" },
  { name: "Раковина", category: "Сантехника" },
  { name: "Ванна", category: "Сантехника" },
  { name: "Люстра", category: "Освещение" },
  { name: "Встр. светильник", category: "Освещение" },
  { name: "Трек", category: "Освещение" },
  { name: "Бра", category: "Освещение" },
];

interface EquipmentBlockProps {
  onNext: () => void;
  onBack: () => void;
}

interface EditingState {
  roomId: string;
  roomIndex: number;
  id: string;
  name: string;
  category: string;
  quantity: number;
  manufacturer: string;
  url: string;
  price: number | "";
  description: string;
  isNew: boolean;
}

export default function EquipmentBlock({
  onNext,
  onBack,
}: EquipmentBlockProps) {
  const { equipmentData, setEquipmentData, premisesData } = useBriefStore();

  const defaultValues = useMemo(() => {
    if (equipmentData?.rooms?.length) return equipmentData;
    return {
      rooms:
        premisesData?.rooms?.map((room, index) => ({
          room_id: `room-${index}`,
          room_name: room.name,
          equipment: [],
        })) || [],
    };
  }, [equipmentData, premisesData]);

  const form = useForm<EquipmentBlockFormValues>({
    resolver: zodResolver(EquipmentBlockSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields: roomsFields } = useFieldArray({
    control: form.control,
    name: "rooms",
  });

  const [editing, setEditing] = useState<EditingState | null>(null);

  // --- ЛОГИКА БЫСТРОГО ДОБАВЛЕНИЯ ---
  const handleQuickAdd = (
    roomId: string,
    roomIndex: number,
    templateName: string,
    templateCategory: string,
  ) => {
    const currentEquipment =
      form.getValues(`rooms.${roomIndex}.equipment`) || [];

    // Ищем, есть ли уже такой предмет
    const existingItemIndex = currentEquipment.findIndex(
      (eq: any) => eq.name === templateName,
    );

    if (existingItemIndex >= 0) {
      // Если есть - просто плюсуем количество
      const updatedEquipment = [...currentEquipment];
      updatedEquipment[existingItemIndex].quantity =
        (updatedEquipment[existingItemIndex].quantity || 1) + 1;
      form.setValue(`rooms.${roomIndex}.equipment`, updatedEquipment, {
        shouldDirty: true,
      });
    } else {
      // Если нет - добавляем новый
      const newItem = {
        id: Date.now().toString(),
        room_id: roomId,
        name: templateName,
        category: templateCategory,
        quantity: 1,
      };
      form.setValue(
        `rooms.${roomIndex}.equipment`,
        [...currentEquipment, newItem],
        { shouldDirty: true },
      );
    }
  };
  // ----------------------------------

  const handleAddNewCustom = (roomId: string, roomIndex: number) => {
    setEditing({
      roomId,
      roomIndex,
      id: Date.now().toString(),
      name: "",
      category: "Другое",
      quantity: 1,
      manufacturer: "",
      url: "",
      price: "",
      description: "",
      isNew: true,
    });
  };

  const handleEdit = (roomId: string, roomIndex: number, item: any) => {
    setEditing({
      roomId,
      roomIndex,
      id: item.id,
      name: item.name || "",
      category: item.category || "Другое",
      quantity: item.quantity ?? 1,
      manufacturer: item.manufacturer || "",
      url: item.url || "",
      price: item.price ?? "",
      description: item.description || "",
      isNew: false,
    });
  };

  const handleDelete = (roomIndex: number, equipmentId: string) => {
    const currentEquipment =
      form.getValues(`rooms.${roomIndex}.equipment`) || [];
    form.setValue(
      `rooms.${roomIndex}.equipment`,
      currentEquipment.filter((eq: any) => eq.id !== equipmentId),
      { shouldDirty: true },
    );
  };

  const saveDrawer = () => {
    if (!editing || !editing.name.trim()) return;

    const { roomIndex, roomId } = editing;
    const currentEquipment =
      form.getValues(`rooms.${roomIndex}.equipment`) || [];

    const newItem = {
      id: editing.id,
      name: editing.name.trim(),
      room_id: roomId,
      category: editing.category,
      quantity: Math.max(1, editing.quantity),
      manufacturer: editing.manufacturer.trim(),
      url: editing.url.trim(),
      price: editing.price !== "" ? Number(editing.price) : undefined,
      description: editing.description.trim(),
    };

    if (editing.isNew) {
      form.setValue(
        `rooms.${roomIndex}.equipment`,
        [...currentEquipment, newItem],
        {
          shouldDirty: true,
        },
      );
    } else {
      form.setValue(
        `rooms.${roomIndex}.equipment`,
        currentEquipment.map((eq: any) =>
          eq.id === editing.id ? newItem : eq,
        ),
        { shouldDirty: true },
      );
    }
    setEditing(null);
  };

  const onSubmit = useCallback(
    (data: EquipmentBlockFormValues) => {
      try {
        setEquipmentData(data);
        toast.success("Наполнение сохранено");
        onNext();
      } catch (error) {
        toast.error("Ошибка при сохранении данных");
      }
    },
    [setEquipmentData, onNext],
  );

  const watchRooms = form.watch("rooms");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 flex w-full flex-col"
      >
        <BriefBlockMain title="Наполнение помещений">
          {roomsFields.length === 0 ? (
            <div className="p-6 text-center bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm text-amber-800">
                Сначала добавьте помещения
              </p>
            </div>
          ) : (
            <Accordion type="multiple" className="w-full space-y-2">
              {roomsFields.map((roomField, index) => {
                const currentRoom = watchRooms[index];
                const equipmentList = currentRoom?.equipment || [];

                // Группируем предметы по категориям
                const groupedEquipment = equipmentList.reduce(
                  (acc: any, curr: any) => {
                    const cat = curr.category || "Другое";
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(curr);
                    return acc;
                  },
                  {},
                );

                return (
                  <AccordionItem
                    value={roomField.id}
                    key={roomField.id}
                    className="rounded-2xl px-4 shadow-sm border bg-card"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-semibold text-left">
                          {currentRoom.room_name}
                        </span>
                        {equipmentList.length > 0 && (
                          <span className="text-xs bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full ml-2">
                            {equipmentList.reduce(
                              (acc: number, curr: any) =>
                                acc + (curr.quantity || 1),
                              0,
                            )}{" "}
                            шт.
                          </span>
                        )}
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-2 pb-4 space-y-6">
                      {/* ОТОБРАЖЕНИЕ СГРУППИРОВАННЫХ ПРЕДМЕТОВ */}
                      {Object.keys(groupedEquipment).length > 0 && (
                        <div className="space-y-5">
                          {Object.entries(groupedEquipment).map(
                            ([categoryName, items]: [string, any]) => (
                              <div key={categoryName} className="space-y-2">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                                  {categoryName}
                                </h4>
                                <div className="space-y-2">
                                  {items.map((item: any) => (
                                    <div
                                      key={item.id}
                                      className="flex items-start justify-between p-3 rounded-xl bg-secondary/20 border gap-3"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <p className="font-medium text-sm truncate">
                                            {item.name}
                                          </p>
                                          {item.quantity > 1 && (
                                            <span className="text-xs bg-secondary px-1.5 py-0.5 rounded text-muted-foreground whitespace-nowrap">
                                              × {item.quantity} шт.
                                            </span>
                                          )}
                                        </div>
                                        {(item.manufacturer || item.price) && (
                                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                            {item.manufacturer}
                                            {item.price
                                              ? ` — ${item.price} ₽`
                                              : ""}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex shrink-0 gap-1">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                                          onClick={() =>
                                            handleEdit(
                                              currentRoom.room_id,
                                              index,
                                              item,
                                            )
                                          }
                                        >
                                          <Settings2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                          onClick={() =>
                                            handleDelete(index, item.id)
                                          }
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}

                      <hr className="border-border" />

                      {/* БЛОК БЫСТРОГО ДОБАВЛЕНИЯ И НОВОГО ПРЕДМЕТА */}
                      <div className="space-y-3">
                        <Label className="text-xs text-muted-foreground">
                          Быстрое добавление (кликните, чтобы добавить +1)
                        </Label>
                        <div className="flex flex-wrap gap-1.5">
                          {QUICK_ADD_TEMPLATES.map((template) => (
                            <Button
                              key={template.name}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 rounded-full bg-background"
                              onClick={() =>
                                handleQuickAdd(
                                  currentRoom.room_id,
                                  index,
                                  template.name,
                                  template.category,
                                )
                              }
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {template.name}
                            </Button>
                          ))}
                        </div>

                        <Button
                          type="button"
                          variant="secondary"
                          className="w-full mt-2 border-dashed border"
                          onClick={() =>
                            handleAddNewCustom(currentRoom.room_id, index)
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Добавить свой предмет / Указать детали
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}

          <ResponsivePanel
            title={editing?.isNew ? "Свой предмет" : "Детали предмета"}
            open={!!editing}
            onClose={saveDrawer}
            onOpenChange={(open) => !open && setEditing(null)}
          >
            {editing && (
              <div className="p-4 space-y-5 overflow-y-auto max-h-[80vh]">
                <div className="space-y-2">
                  <Label>Название</Label>
                  <Input
                    placeholder="Например: Изголовье на заказ"
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Категория</Label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {CATEGORIES.map((cat) => (
                      <Button
                        key={cat}
                        type="button"
                        variant={
                          editing.category === cat ? "default" : "secondary"
                        }
                        size="sm"
                        className="text-xs h-7 rounded-full"
                        onClick={() =>
                          setEditing({ ...editing, category: cat })
                        }
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Количество</Label>
                  <div className="flex items-center gap-3 w-32">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 shrink-0 rounded-lg"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          quantity: Math.max(1, editing.quantity - 1),
                        })
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={editing.quantity}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          quantity: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                      className="text-center h-9"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 shrink-0 rounded-lg"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          quantity: editing.quantity + 1,
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Производитель / Бренд</Label>
                  <Input
                    value={editing.manufacturer}
                    onChange={(e) =>
                      setEditing({ ...editing, manufacturer: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ориентировочная цена (₽)</Label>
                  <Input
                    type="number"
                    value={editing.price}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        price:
                          e.target.value === "" ? "" : Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ссылка (URL)</Label>
                  <Input
                    type="url"
                    value={editing.url}
                    onChange={(e) =>
                      setEditing({ ...editing, url: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Примечание</Label>
                  <Textarea
                    rows={3}
                    value={editing.description}
                    onChange={(e) =>
                      setEditing({ ...editing, description: e.target.value })
                    }
                  />
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
