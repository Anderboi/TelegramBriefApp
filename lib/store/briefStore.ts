import { create } from 'zustand';
import { 
  CommonFormValues, 
  ResidentsFormValues, 
  PremisesFormValues, 
  DemolitionType, 
  ConstructionFormValues, 
  EquipmentBlockFormValues 
} from '@/lib/schemas';

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
  
  // Методы для сохранения в localStorage
  saveToStorage: () => void;
  loadFromStorage: () => void;
  clearAllData: () => void;
}

// Ключи для localStorage
const STORAGE_KEYS = {
 COMMON: 'commonInfoBlockData',
  RESIDENTS: 'residentsData',
  PREMISES: 'premisesData',
  DEMOLITION: 'demolitionData',
  CONSTRUCTION: 'constructionData',
  EQUIPMENT: 'equipmentData',
};

export const useBriefStore = create<BriefState>((set, get) => ({
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
  
  // Сохранение в localStorage
  saveToStorage: () => {
    const state = get();
    
    if (state.commonData) {
      localStorage.setItem(STORAGE_KEYS.COMMON, JSON.stringify(state.commonData));
    }
    if (state.residentsData) {
      localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(state.residentsData));
    }
    if (state.premisesData) {
      localStorage.setItem(STORAGE_KEYS.PREMISES, JSON.stringify(state.premisesData));
    }
    if (state.demolitionData) {
      localStorage.setItem(STORAGE_KEYS.DEMOLITION, JSON.stringify(state.demolitionData));
    }
    if (state.constructionData) {
      localStorage.setItem(STORAGE_KEYS.CONSTRUCTION, JSON.stringify(state.constructionData));
    }
    if (state.equipmentData) {
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(state.equipmentData));
    }
  },
  
  // Загрузка из localStorage
  loadFromStorage: () => {
    try {
      const commonData = localStorage.getItem(STORAGE_KEYS.COMMON);
      const residentsData = localStorage.getItem(STORAGE_KEYS.RESIDENTS);
      const premisesData = localStorage.getItem(STORAGE_KEYS.PREMISES);
      const demolitionData = localStorage.getItem(STORAGE_KEYS.DEMOLITION);
      const constructionData = localStorage.getItem(STORAGE_KEYS.CONSTRUCTION);
      const equipmentData = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
      
      set({
        commonData: commonData ? JSON.parse(commonData) : null,
        residentsData: residentsData ? JSON.parse(residentsData) : null,
        premisesData: premisesData ? JSON.parse(premisesData) : null,
        demolitionData: demolitionData ? JSON.parse(demolitionData) : null,
        constructionData: constructionData ? JSON.parse(constructionData) : null,
        equipmentData: equipmentData ? JSON.parse(equipmentData) : null,
      });
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
 },
  
  // Очистка всех данных
  clearAllData: () => {
    localStorage.removeItem(STORAGE_KEYS.COMMON);
    localStorage.removeItem(STORAGE_KEYS.RESIDENTS);
    localStorage.removeItem(STORAGE_KEYS.PREMISES);
    localStorage.removeItem(STORAGE_KEYS.DEMOLITION);
    localStorage.removeItem(STORAGE_KEYS.CONSTRUCTION);
    localStorage.removeItem(STORAGE_KEYS.EQUIPMENT);
    
    set({
      commonData: null,
      residentsData: null,
      premisesData: null,
      demolitionData: null,
      constructionData: null,
      equipmentData: null,
    });
  },
}));