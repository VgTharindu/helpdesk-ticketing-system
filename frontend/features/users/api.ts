import { apiClient } from "@/lib/api/client";
import type { Paginated, User } from "@/lib/api/types";

export interface UserListParams {
  role?: string;
  per_page?: number;
  page?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: "agent" | "admin";
}

export function listUsers(params: UserListParams) {
  return apiClient<Paginated<User>>("/admin/users", { params });
}

export function createStaffUser(payload: CreateStaffPayload) {
  return apiClient<{ message: string; data: User }>("/admin/users", { method: "POST", body: payload });
}

export function changeUserRole(userId: number, role: string) {
  return apiClient<{ message: string; data: User }>(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: { role },
  });
}