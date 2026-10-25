import { apiClient } from "@/lib/api/client";
import type { ApiDataResponse, DashboardData } from "@/lib/api/types";

export function getDashboard() {
  return apiClient<ApiDataResponse<DashboardData>>("/dashboard");
}