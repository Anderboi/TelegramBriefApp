export const optionsMaker = (data: string[]) => {
  let newOptions: Option[] = [];

  data.map((item) => {
    newOptions.push({ label: item, value: item });
  });

  return newOptions;
};

export type Option = {
  value: string;
  label: string;
  group?: string;
};

export const roomList: Option[] = [
  {
    value: "Прихожая",
    label: "Прихожая",
  },
  {
    value: "Гостиная",
    label: "Гостиная",
  },
  {
    value: "Кухня",
    label: "Кухня",
  },
  {
    value: "Столовая",
    label: "Столовая",
  },
  {
    value: "Спальня",
    label: "Спальня",
  },
  {
    value: "Детская",
    label: "Детская",
  },
  {
    value: "Гардеробная",
    label: "Гардеробная",
  },
  {
    value: "Ванная комната",
    label: "Ванная комната",
  },
  {
    value: "Санузел",
    label: "Санузел",
  },
  {
    value: "Постирочная",
    label: "Постирочная",
  },
];
export const wallMaterials: string[] = [
  "Кирпич",
  "Пазогребневые плиты (ПГП)",
  "Керамзитобетонные блоки",
  "Газобетон или пенобетон",
  "Гипсокартон",
];

export const floorMaterials: string[] = [
  "Инженерная доска",
  "Паркетная доска",
  "Ламинат",
  "Кварцвинил",
  "Керамогранит",
  "Натуральный камень",
  "Микроцемент",
];

export const ceilingMaterials: string[] = [
  "Гипсокартон",
  "Натяжной потолок",
  "Без подшивки",
];

export const heatingSystems: string[] = [
  "Радиаторы",
  "Конвекторы",
  "Воздушная система отопления",
  "ИК-радиаторы",
  "Теплый пол",
];

export const conditioningSystems: string[] = [
  "Сплит-система",
  "Канальная",
  "Приточно-вытяжная",
  "Бризер",
  "Увлажнитель воздуха",
];

export const electricSystems: string[] = [
  "Управление климатом",
  "Управление отоплением",
  "Управление освещением",
  "Управление медиа",
  "Управление сигнализацией",
  "Управление видеонаблюдением",
  "Установка датчиков протечки воды",
  "Управление шторами",
  "Установка RJ45 розеток (интернет)",
];

export const purificationSystems: string[] = [
  "Станция очистки воды",
  "Магистральные фильтры",
  "Фильтр обратного осмоса",
  "УФ очистка воды",
];

export const furnitureList: string[] = [
  "Диван",
  "Кресло",
  "Обеденный стол",
  "Стул",
  "Кровать",
  "Комод",
  "Шкаф",
  "Тумба",
  "Журнальный стол",
  "Кухонный остров",
  "Рабочий стол",
];

export const furnitureOptions = optionsMaker(furnitureList);

export const equipmentOptions: Option[] = [
  { value: "Холодильник", label: "Холодильник", group: "Кухня" },
  { value: "Духовой шкаф", label: "Духовой шкаф", group: "Кухня" },
  { value: "Варочная панель", label: "Варочная панель", group: "Кухня" },
  {
    value: "Посудомоечная машина",
    label: "Посудомоечная машина",
    group: "Кухня",
  },
  { value: "Вытяжка", label: "Вытяжка", group: "Кухня" },
  { value: "Винный шкаф", label: "Винный шкаф", group: "Кухня" },
  { value: "Морозильник", label: "Морозильник", group: "Кухня" },
  { value: "Микроволновая печь", label: "Микроволновая печь", group: "Кухня" },
  {
    value: "Измельчитель отходов",
    label: "Измельчитель отходов",
    group: "Кухня",
  },
  { value: "Унитаз", label: "Унитаз", group: "Сантехника" },
  { value: "Биде", label: "Биде", group: "Сантехника" },
  {
    value: "Гигиенический душ",
    label: "Гигиенический душ",
    group: "Сантехника",
  },
  { value: "Душ", label: "Душ", group: "Сантехника" },
  { value: "Ванна", label: "Ванна", group: "Сантехника" },
  { value: "Умывальник", label: "Умывальник", group: "Сантехника" },
  {
    value: "Полотенцесушитель",
    label: "Полотенцесушитель",
    group: "Сантехника",
  },
];
