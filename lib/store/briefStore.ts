import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CommonFormValues,
  ResidentsFormValues,
  PremisesFormValues,
  DemolitionType,
  ConstructionFormValues,
  EquipmentBlockFormValues,
} from "@/lib/schemas";

interface BriefState {
  // Данные формы
  commonData: CommonFormValues | null;
  residentsData: ResidentsFormValues | null;
  premisesData: PremisesFormValues | null;
  demolitionData: DemolitionType | null;
  constructionData: ConstructionFormValues | null;
  equipmentData: EquipmentBlockFormValues | null;

  // Методы для обновления данных
  setCommonData: (data: CommonFormValues) => void;
  setResidentsData: (data: ResidentsFormValues) => void;
  setPremisesData: (data: PremisesFormValues) => void;
  setDemolitionData: (data: DemolitionType) => void;
  setConstructionData: (data: ConstructionFormValues) => void;
  setEquipmentData: (data: EquipmentBlockFormValues) => void;

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

      // Методы для обновления данных
      setCommonData: (data) => set({ commonData: data }),
      setResidentsData: (data) => set({ residentsData: data }),
      setPremisesData: (data) => set({ premisesData: data }),
      setDemolitionData: (data) => set({ demolitionData: data }),
      setConstructionData: (data) => set({ constructionData: data }),
      setEquipmentData: (data) => set({ equipmentData: data }),

      resetBrief: () =>
        set({
          commonData: null,
          residentsData: null,
          premisesData: null,
          demolitionData: null,
          constructionData: null,
          equipmentData: null,
        }),
    }),
    {
      name: "brief-storage",
    },
  ),
);
