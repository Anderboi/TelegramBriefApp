import { useCallback, useRef } from 'react';

/**
 * Хук для мемоизации вычислительно сложных функций
 * @param fn Функция для мемоизации
 * @param deps Зависимости для пересчета
 * @returns Мемоизированная функция
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  fn: T,
  deps: React.DependencyList
): T {
  const fnRef = useRef<T>(fn);
  
  // Обновляем ссылку на функцию при изменении зависимостей
  fnRef.current = useCallback(fn, deps) as T;
  
  return useCallback(
    (...args: Parameters<T>) => fnRef.current(...args),
    [fnRef]
  ) as T;
}

/**
 * Хук для мемоизации вычислительно сложных значений
 * @param factory Функция, возвращающая значение
 * @param deps Зависимости для пересчета
 * @returns Мемоизированное значение
 */
export function useMemoizedValue<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  const valueRef = useRef<{ value: T; deps: React.DependencyList } | null>(null);
  
  // Проверяем, изменились ли зависимости
  const depsChanged = deps.some(
    (dep, index) => 
      valueRef.current === null || 
      dep !== valueRef.current.deps[index]
  );
  
 if (depsChanged || valueRef.current === null) {
    valueRef.current = {
      value: factory(),
      deps: [...deps],
    };
 }
  
  return valueRef.current.value;
}