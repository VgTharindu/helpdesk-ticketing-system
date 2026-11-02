import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "@/lib/api-client";
import type { Paginated, User } from "@/lib/types";

// Schemas (create staff form)

export const createStaffSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(255, "Name is too long"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(1, "Please confirm the password"),
    role: z.enum(["agent", "admin"], { message: "Select a role" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export type CreateStaffFormValues = z.infer<typeof createStaffSchema>;

// API calls

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

// Hooks

export function useUsers(params: UserListParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => listUsers(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStaffUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useChangeRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) => changeUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
