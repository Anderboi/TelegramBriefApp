// hooks/useFormData.js
import { useState, useEffect } from "react";

const useFormData = <T>(key: string, initialState: T) => {
  const [data, setData] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : initialState;
    }
    return initialState;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }, [data, key]);

  return [data, setData] as const;
};

export default useFormData;
