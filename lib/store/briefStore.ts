import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CommonFormValues,
  ResidentsFormValues,
  PremisesFormValues,
  DemolitionType,
  ConstructionFormValues,
  EquipmentBlockFormValues,
  EngineeringSystemsType,
} from "@/lib/schemas";

interface BriefState {
  // Данные формы
  commonData: CommonFormValues | null;
  residentsData: ResidentsFormValues | null;
  premisesData: PremisesFormValues | null;
  demolitionData: DemolitionType | null;
  constructionData: ConstructionFormValues | null;
  equipmentData: EquipmentBlockFormValues | null;
  engineeringData: EngineeringSystemsType | null;

  // Методы для обновления данных
  setCommonData: (data: CommonFormValues) => void;
  setResidentsData: (data: ResidentsFormValues) => void;
  setPremisesData: (data: PremisesFormValues) => void;
  setDemolitionData: (data: DemolitionType) => void;
  setConstructionData: (data: ConstructionFormValues) => void;
  setEquipmentData: (data: EquipmentBlockFormValues) => void;
  setEngineeringData: (data: any) => void;

  resetBrief: () => void;
}

// Ключи для localStorage
const STORAGE_KEYS = {
  COMMON: "commonInfoBlockData",
  RESIDENTS: "residentsData",
  PREMISES: "premisesData",
  DEMOLITION: "demolitionData",
  CONSTRUCTION: "constructionData",
  EQUIPMENT: "equipmentData",
  ENGINEERING: "engineeringData",
};

export const useBriefStore = create<BriefState>()(
  persist(
    (set) => ({
      // Инициализация состояния из localStorage
      commonData: null,
      residentsData: null,
      premisesData: null,
      demolitionData: null,
      constructionData: null,
      equipmentData: null,
      engineeringData: null,

      // Методы для обновления данных
      setCommonData: (data) => set({ commonData: data }),
      setResidentsData: (data) => set({ residentsData: data }),
      setPremisesData: (data) => set({ premisesData: data }),
      setDemolitionData: (data) => set({ demolitionData: data }),
      setConstructionData: (data) => set({ constructionData: data }),
      setEquipmentData: (data) => set({ equipmentData: data }),
      setEngineeringData: (data) => set({ engineeringData: data }),

      resetBrief: () =>
        set({
          commonData: null,
          residentsData: null,
          premisesData: null,
          demolitionData: null,
          constructionData: null,
          equipmentData: null,
          engineeringData: null,
        }),
    }),
    {
      name: "brief-storage",
    },
  ),
);
