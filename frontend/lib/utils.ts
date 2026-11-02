import { useEffect, useState } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges Tailwind class names (later classes win over earlier ones)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Converts bytes to a short readable size (e.g. 1.4 MB)
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Returns the value only after it stops changing for delayMs (used for search inputs)
export function useDebounce<T>(value: T, delayMs: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
