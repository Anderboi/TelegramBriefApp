import { z } from "zod";

// ? Общие данные
export const CommonDataSchema = z.object({
  address: z.string().min(1, "Введите адрес"),
  area: z.coerce.number().min(1, "Введите площадь"),
  contractNumber: z.string().optional(),
  startDate: z.date().optional(),
  finalDate: z.date().optional(),
});
export type CommonDataType = z.infer<typeof CommonDataSchema>;

// ? Оборудование
export const EquipmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url("Введите корректный URL").optional(),
  price: z
    .number()
    .nonnegative("Стоимость должна быть положительным числом")
    .optional(),
  manufacturer: z.string().optional(),
  description: z.string().optional(),
  quantity: z
    .number()
    .positive("Количество должно быть больше нуля")
    .optional(),
  room_id: z.string().uuid(),
});
export type Equipment = z.infer<typeof EquipmentSchema>;

// ? Помещение
export const PremiseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Необходимо указать название"),
  order: z.coerce.number(),
  area: z.coerce.number().optional(),
  project_id: z.string(),
  equipment: z.array(EquipmentSchema).optional(),
});
export type Premise = z.infer<typeof PremiseSchema>;

// ? Резиденты
export const ResidentsSchema = z.object({
  adults: z
    .array(
      z.object({
        height: z
          .number({ invalid_type_error: "Введите рост числом" })
          .positive("Рост должен быть положительным")
          .lte(250, "Рост не может быть больше 250 см"),
        gender: z.string(),
      }),
    )
    .min(1, "Должен быть хотя бы один взрослый"),
  children: z.array(
    z.object({
      age: z
        .number({ invalid_type_error: "Введите возраст числом" })
        .positive("Возраст должен быть положительным")
        .lte(18, "Возраст должен быть меньше 18 лет"),
    }),
  ),
  hobbies: z.string().optional(),
  healthIssues: z.string().optional(),
  hasPets: z.boolean(),
  petDetails: z.string().optional(),
});
export type ResidentsFormValues = z.infer<typeof ResidentsSchema>;

// ? Монтаж
export const ConstructionInfoSchema = z.object({
  floor: z.array(
    z
      .object({
        id: z.coerce.number(),
        material: z.string(),
        rooms: z.array(z.string()),
      })
      .optional(),
  ),
  ceiling: z.array(
    z
      .object({
        id: z.coerce.number(),
        material: z.string(),
        rooms: z.array(z.string()),
      })
      .optional(),
  ),
  walls: z.array(
    z.object({
      id: z.coerce.number(),
      material: z.string(),
      rooms: z.array(z.string()),
    }),
  ),
});
export type ConstructionFormValues = z.infer<typeof ConstructionInfoSchema>;

// ? Демонтаж
export const DemolitionSchema = z.object({
  projectId: z.string().optional(),
  planChange: z.boolean().optional(),
  planChangeInfo: z.string().optional(),
  entranceDoorChange: z.boolean().optional(),
  enteranceDoorType: z.string().optional(),
  windowsChange: z.boolean().optional(),
  windowsType: z.string().optional(),
  furnitureDemolition: z.boolean().optional(),
  furnitureToDemolish: z.string().optional(),
});
export type DemolitionType = z.infer<typeof DemolitionSchema>;

// ? Инженерные Системы
export const EngineeringSystemsSchema = z.object({
  heatingSystem: z
    .array(
      z.object({
        id: z.coerce.number(),
        system: z.string(),
        rooms: z.array(z.string()),
      }),
    )
    .optional(),
  // warmFloor: z.boolean().optional(),
  warmFloorRooms: z
    .array(
      z.object({
        id: z.coerce.number(),
        system: z.string(),
        rooms: z.array(z.string()),
      }),
    )
    .optional(),

  conditioningSystem: z
    .array(
      z.object({
        id: z.coerce.number(),
        system: z.string(),
        rooms: z.array(z.string()),
      }),
    )
    .optional(),

  purificationSystem: z
    .array(
      z.object({
        id: z.coerce.number(),
        system: z.string(),
        rooms: z.array(z.string()),
      }),
    )
    .optional(),

  electricSystem: z
    .array(
      z.object({
        id: z.coerce.number(),
        system: z.string(),
        rooms: z.array(z.string()),
      }),
    )
    .optional(),
});
export type EngineeringSystemsType = z.infer<typeof EngineeringSystemsSchema>;

export type SystemType =
  | "heating"
  | "conditioning"
  | "purification"
  | "electric";

export type SystemRecord = {
  project_id: string; // ID проекта (нужно передать извне)
  system: string; // Название системы
  type: SystemType; // Тип системы
  rooms: string[]; // Массив ID помещений
};