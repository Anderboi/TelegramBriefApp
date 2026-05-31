"use client";

import { useState, useEffect } from "react";
import { Check, Minus } from "lucide-react";
import { GuideItem } from "@/lib/schemas/guide";
import { Button } from "@/components/ui/button";

interface GuideContentProps {
  category: string;
  onSelect: (materialTitle: string) => void;
}

export default function GuideContent({
  category,
  onSelect,
}: GuideContentProps) {
  const [items, setItems] = useState<GuideItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Ленивая загрузка словаря (T5)
  useEffect(() => {
    let isMounted = true;

    const loadGuide = async () => {
      setLoading(true);
      try {
        let data: GuideItem[] = [];
        // Динамический импорт нужного файла в зависимости от открытой категории
        if (category === "floor") {
          const mod = await import("@/lib/guides/floor");
          data = mod.floorGuide;
        } else if (category === "ceiling") {
          const mod = await import("@/lib/guides/ceiling");
          data = mod.ceilingGuide;
        } else if (category === "heatingSystem") {
          const mod = await import("@/lib/guides/engineering");
          data = mod.heatingGuide;
        } else if (category === "conditioningSystem") {
          const mod = await import("@/lib/guides/engineering");
          data = mod.conditioningGuide;
        } else if (category === "purificationSystem") {
          const mod = await import("@/lib/guides/engineering");
          data = mod.purificationGuide;
        } else if (
          category === "warmFloorSystem" ||
          category === "warmFloorRooms"
        ) {
          // Зависит от того, какой ключ у вас используется в форме
          const mod = await import("@/lib/guides/engineering");
          data = mod.warmFloorGuide;
        } else if (category === "electricSystem") {
          const mod = await import("@/lib/guides/engineering");
          data = mod.electricGuide;
        } else if (
          category === "waterSystem" ||
          category === "plumbingSystem"
        ) {
          const mod = await import("@/lib/guides/engineering");
          data = mod.waterGuide;
        }

        if (isMounted) setItems(data);
      } catch (error) {
        console.error("Ошибка при загрузке справочника:", error);
        if (isMounted) setItems([]); // Fallback на пустой массив
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadGuide();

    return () => {
      isMounted = false;
    };
  }, [category]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground space-y-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm">Загрузка справочника...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="p-10 text-center text-sm text-muted-foreground bg-secondary/20 rounded-xl m-4">
        Справочная информация для раздела «{category}» пока в разработке.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5 overflow-y-auto">
      {items.map((item) => (
        <div
          key={item.id}
          className="border rounded-2xl p-5 bg-card shadow-sm space-y-4"
        >
          {/* Заголовок и теги */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold text-lg">{item.title}</h4>
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded font-medium shrink-0">
                {item.priceRange}
              </span>
            </div>

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </p>

          {/* Плюсы и минусы */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-secondary/20 p-3 rounded-xl">
            <div>
              <span className="font-medium text-emerald-600 flex items-center gap-1.5 mb-2">
                <Check className="w-3.5 h-3.5" /> Плюсы
              </span>
              <ul className="space-y-1.5">
                {item.pros.map((p, i) => (
                  <li
                    key={i}
                    className="text-muted-foreground flex items-start text-xs leading-tight"
                  >
                    <span className="text-emerald-500 mr-1.5">•</span> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-medium text-rose-600 flex items-center gap-1.5 mb-2">
                <Minus className="w-3.5 h-3.5" /> Минусы
              </span>
              <ul className="space-y-1.5">
                {item.cons.map((c, i) => (
                  <li
                    key={i}
                    className="text-muted-foreground flex items-start text-xs leading-tight"
                  >
                    <span className="text-rose-400 mr-1.5">•</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Интерактивность: Кнопка выбора */}
          <Button className="w-full mt-2" onClick={() => onSelect(item.title)}>
            Выбрать 
            {/* {item.title.toLowerCase()} */}
          </Button>
        </div>
      ))}
    </div>
  );
}
