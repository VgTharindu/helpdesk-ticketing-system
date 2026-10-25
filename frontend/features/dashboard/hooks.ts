'use client';

import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "./api";
import { useAuthStore } from "@/stores/auth-store";

export function useDashboard() {
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    enabled: !isAuthLoading && user !== null,
    refetchInterval: 60 * 1000,
  });
}