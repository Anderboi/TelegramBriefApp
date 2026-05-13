"use client";

import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import BriefBlockMain from "@/components/ui/brief-block-main";
import BottomButtonBlock from "@/components/ui/bottom-button-block";

import { ConstructionFormValues, ConstructionInfoSchema } from "@/lib/schemas";
import { useBriefStore } from "@/lib/store/briefStore";
import { CONSTRUCTION_CATEGORIES, ConstructionCategory } from "@/lib/constants";
import { useRoomToggle } from '@/lib/hooks/useRoomToggle';
import { MaterialSection } from '@/components/material-section';

// ─── Типы ────────────────────────────────────────────────────────────────────

interface ConstructionBlockProps {
  onNext: () => void;
  onBack: () => void;
}

// ─── Компонент ───────────────────────────────────────────────────────────────

const ConstructionBlock: React.FC<ConstructionBlockProps> = ({
  onNext,
  onBack,
}) => {
  const { constructionData, setConstructionData, premisesData } =
    useBriefStore();

  const [expandedCategories, setExpandedCategories] = useState<
    Set<ConstructionCategory>
  >(new Set(["walls", "ceiling", "floor"]));

  // Список комнат
  const roomList = useMemo(
    () =>
      premisesData?.rooms?.map((room, index) => ({
        id: `room-${index}`,
        name: room.name,
        order: room.order,
      })) ?? [],
    [premisesData],
  );

  const form = useForm<ConstructionFormValues>({
    resolver: zodResolver(ConstructionInfoSchema),
    mode: "onBlur",
    defaultValues: constructionData ?? {
      floor: [{ type: "", material: "", rooms: [] }],
      ceiling: [{ type: "", material: "", rooms: [] }],
      walls: [{ type: "", material: "", rooms: [] }],
    },
  });

  // Логика toggle комнат — в хуке
  const { toggleRoom, toggleAllRooms } = useRoomToggle(form, roomList);

  const toggleCategory = useCallback((category: ConstructionCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(category) ? next.delete(category) : next.add(category);
      return next;
    });
  }, []);

  const onSubmit = useCallback(
    (data: ConstructionFormValues) => {
      try {
        // Фильтруем незаполненные секции
        const cleanedData: ConstructionFormValues = {
          floor: data.floor?.filter((i) => i?.type && i.rooms?.length) ?? [],
          ceiling:
            data.ceiling?.filter((i) => i?.type && i.rooms?.length) ?? [],
          walls: data.walls?.filter((i) => i?.type && i.rooms?.length) ?? [],
        };

        setConstructionData(cleanedData);
        toast.success("Информация по монтажу сохранена");
        onNext();
      } catch (error) {
        console.error("[ConstructionBlock] submit error:", error);
        toast.error("Ошибка при сохранении данных");
      }
    },
    [setConstructionData, onNext],
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full w-full flex-col"
      >
        <BriefBlockMain title="Информация по монтажу">
          {CONSTRUCTION_CATEGORIES.map(({ key, title, types }) => (
            <MaterialSection
              key={key}
              category={key}
              title={title}
              types={types}
              roomList={roomList}
              isExpanded={expandedCategories.has(key)}
              onToggleExpanded={() => toggleCategory(key)}
              onToggleRoom={(sectionIndex, roomId) =>
                toggleRoom(key, sectionIndex, roomId)
              }
              onToggleAllRooms={(sectionIndex) =>
                toggleAllRooms(key, sectionIndex)
              }
            />
          ))}
        </BriefBlockMain>

        <BottomButtonBlock onBack={onBack} />
      </form>
    </Form>
  );
};

export default ConstructionBlock;
