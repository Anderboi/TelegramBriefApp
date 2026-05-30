export type PriceRange = "₽" | "₽₽" | "₽₽₽";

export interface GuideItem {
  /** Уникальный идентификатор (например: "laminate", "quartz_vinyl") */
  id: string;
  /** Название материала, которое подставится в форму (например: "Кварцвинил") */
  title: string;
  /** Краткое описание материала */
  description: string;
  /** Список плюсов */
  pros: string[];
  /** Список минусов */
  cons: string[];
  /** Ценовой сегмент */
  priceRange: PriceRange;
  /** (Опционально) Теги свойств: влагостойкий, теплый пол и т.д. */
  tags?: string[];
}

/** * Словарь, где ключ — это категория из формы (например, 'floor', 'ceiling', 'walls'),
 * а значение — массив элементов справочника.
 */
export type GuideDictionary = Record<string, GuideItem[]>;
