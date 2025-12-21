import { useSearchParams } from 'react-router';
import { useCallback, useMemo } from 'react';

type UseQueryFiltersOptions<T extends string> = {
  paramName: string;
  defaultValue?: T | null;
  validValues?: readonly T[];
};

/**
 * Хук для работы с фильтрами через query параметры URL
 * @param options - Опции для настройки фильтра
 * @returns Объект с текущим значением фильтра и функцией для его обновления
 */
export const useQueryFilter = <T extends string>({
  paramName,
  defaultValue = null,
  validValues,
}: UseQueryFiltersOptions<T>) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = useMemo(() => {
    const paramValue = searchParams.get(paramName);
    if (!paramValue) return defaultValue;

    // Если указаны валидные значения, проверяем соответствие
    if (validValues && !validValues.includes(paramValue as T)) {
      return defaultValue;
    }

    return paramValue as T;
  }, [searchParams, paramName, defaultValue, validValues]);

  const setValue = useCallback(
    (newValue: T | null) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (newValue === null || newValue === defaultValue) {
          newParams.delete(paramName);
        } else {
          newParams.set(paramName, newValue);
        }
        return newParams;
      });
    },
    [setSearchParams, paramName, defaultValue],
  );

  return [value, setValue] as const;
};
