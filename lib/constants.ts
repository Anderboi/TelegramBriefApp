// Storage keys для localStorage
export const STORAGE_KEYS = {
  COMMON_INFO: "commonInfoBlockData",
  PREMISES: "premisesData",
  RESIDENTS: "residentsData",
  DEMOLITION: "demolitionData",
  CONSTRUCTION: "constructionData",
  EQUIPMENT: "equipmentData",
} as const;

// Типы помещений
export const ROOM_TYPES = [
  { value: "living", label: "Жилая", emoji: "🏠" },
  { value: "utility", label: "Хозяйственная", emoji: "🔧" },
  { value: "wet", label: "Мокрая зона", emoji: "💧" },
  { value: "technical", label: "Техническая", emoji: "⚙️" },
] as const;

export const CONSTRUCTION_SECTIONS: {
  key: ConstructionCategory;
  label: string;
  templates: string[];
}[] = [
  {
    key: "floor",
    label: "Полы",
    templates: [
      "Керамогранит",
      "Камень натуральный",
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
      "Керамогранит",
      "Камень натуральный",
    ],
  },
];

export const CONSTRUCTION_CATEGORIES = [
  {
    key: "walls" as const,
    title: "Стены",
    types: [
      "Покраска",
      "Обои",
      "Декоративная штукатурка",
      "Панели",
      "Микроцемент",
      "Керамогранит",
      "Камень натуральный",
      "Другое",
    ],
  },
  {
    key: "ceiling" as const,
    title: "Потолок",
    types: [
      "Гипсокартонный",
      "Натяжной",
      "Под покраску",
      "Реечный",
      "Бетон (Лофт)",
      "Подвесной",
      "Другое",
    ],
  },
  {
    key: "floor" as const,
    title: "Напольные покрытия",
    types: [
      "Керамогранит",
      "Камень натуральный",
      "Паркетная доска",
      "Инженерная доска",
      "Ламинат",
      "Кварцвинил",
      "Микроцемент",
      "Ковролин",
      "Наливной пол",
      "Другое",
    ],
  },
] as const;

export type ConstructionCategory =
  (typeof CONSTRUCTION_CATEGORIES)[number]["key"];
export const OTHER_TYPE = "Другое" as const;

export const ENGINEERING_OPTIONS = {
  heating: [
    "Радиаторы",
    "Внутрипольные конвекторы",
    "Полотенцесушитель",
    "ИК радиаторы",
    "Теплый плинтус",
    "Не требуется",
  ],
  warmFloor: [
    "Водяной тёплый пол",
    "Электрический тёплый пол",
    "Инфракрасный тёплый пол",
    "Не требуется",
  ],
  conditioning: [
    "Сплит-система",
    "Канальная система",
    "Канальный увлажнитель воздуха",
    "Адиабатическая система",
    "VRF система",
    "Приточно-вытяжная система",
    "Бризер",
    "Не требуется",
  ],
  purification: [
    "Фильтр грубой очистки",
    "Станция очистки воды",
    "Фильтры обратного осмоса",
    "Магистральные фильтры очистки",
    "Накопительный водонагреватель",
    "Проточный водонагреватель",
    "Система мгновенного кипячения воды",
    "Не требуется",
  ],
  electric: [
    "KNX система",
    "Алиса",
    "Управление шторами",
    "Управление освещением",
    "Управление отоплением",
    "Пожарная сигнализация",
    "Охранная система",
    "Видеонаблюдение",
    "Видеодомофон",
    "Медиа хаб",
    "Не требуется",
  ],
};