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

// Материалы для отделки
export const FLOOR_TYPES = [
  "Керамогранит",
  "Ламинат",
  "Паркет",
  "Инженерная доска",
  "Линолеум",
  "Другое",
] as const;

export const CEILING_TYPES = [
  "Натяжной потолок",
  "Покраска",
  "Гипсокартонный потолок",
  "Другое",
] as const;

export const WALL_TYPES = [
  "Покраска",
  "Обои",
  "Декоративная штукатурка",
  "Плитка",
  "Другое",
] as const;
