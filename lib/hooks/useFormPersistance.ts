import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

interface UseFormPersistenceOptions {
  /**
   * Ключ для хранения данных в localStorage
   */
  storageKey: string;

  /**
   * Включить автосохранение при изменении формы
   * @default true
   */
  autoSave?: boolean;

  /**
   * Задержка автосохранения в миллисекундах (debounce)
   * @default 0
   */
  debounceMs?: number;

  /**
   * Callback, вызываемый после успешной загрузки данных
   */
  onLoad?: (data: any) => void;

  /**
   * Callback, вызываемый после успешного сохранения данных
   */
  onSave?: (data: any) => void;
}

/**
 * Хук для автоматического сохранения и загрузки данных формы из localStorage
 */
export const useFormPersistence = <T extends Record<string, any>>(
  form: UseFormReturn<T>,
  options: UseFormPersistenceOptions
) => {
  const {
    storageKey,
    autoSave = true,
    debounceMs = 0,
    onLoad,
    onSave,
  } = options;

  // Загрузка данных из localStorage при монтировании
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
        onLoad?.(parsedData);
      }
    } catch (error) {
      console.error(`Error loading data from ${storageKey}:`, error);
    }
  }, [storageKey, form, onLoad]);

  // Автосохранение при изменении формы
  useEffect(() => {
    if (!autoSave) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const subscription = form.watch((value) => {
      // Очищаем предыдущий таймер
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Устанавливаем новый таймер для debounce
      timeoutId = setTimeout(() => {
        try {
          localStorage.setItem(storageKey, JSON.stringify(value));
          onSave?.(value);
        } catch (error) {
          console.error(`Error saving data to ${storageKey}:`, error);
        }
      }, debounceMs);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [storageKey, form, autoSave, debounceMs, onSave]);
};

/**
 * Утилита для ручного сохранения данных формы
 */
export const saveFormData = <T>(storageKey: string, data: T): boolean => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving data to ${storageKey}:`, error);
    return false;
  }
};

/**
 * Утилита для загрузки данных формы
 */
export const loadFormData = <T>(storageKey: string): T | null => {
  try {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      return JSON.parse(savedData) as T;
    }
    return null;
  } catch (error) {
    console.error(`Error loading data from ${storageKey}:`, error);
    return null;
  }
};

/**
 * Утилита для очистки данных формы
 */
export const clearFormData = (storageKey: string): boolean => {
  try {
    localStorage.removeItem(storageKey);
    return true;
  } catch (error) {
    console.error(`Error clearing data from ${storageKey}:`, error);
    return false;
  }
};

/**
 * Утилита для очистки всех данных brief
 */
export const clearAllBriefData = (storageKeys: string[]): boolean => {
  try {
    storageKeys.forEach((key) => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error("Error clearing all brief data:", error);
    return false;
  }
};
