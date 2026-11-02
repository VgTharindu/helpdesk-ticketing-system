import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import type { ApiDataResponse, DashboardData } from "@/lib/types";

// API calls

export function getDashboard() {
  return apiClient<ApiDataResponse<DashboardData>>("/dashboard");
}

// Hooks

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
