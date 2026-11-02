import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ApiError, apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import type { ApiDataResponse, User } from "@/lib/types";

// Schemas (login / register forms)

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(255, "Name is too long"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

// API calls (login/register/logout go to the Next.js auth routes that set the cookie)

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, json?.message ?? "Something went wrong.", json?.errors);
  }

  return json as T;
}

export function login(payload: LoginPayload) {
  return postJson<ApiDataResponse<{ user: User }>>("/api/login", payload);
}

export function register(payload: RegisterPayload) {
  return postJson<ApiDataResponse<{ user: User }>>("/api/register", payload);
}

export async function logout(): Promise<void> {
  await fetch("/api/logout", { method: "POST" });
}

// Hooks

export function useLogin(options?: { redirectTo?: string }) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setUser(response.data.user);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push(options?.redirectTo ?? "/dashboard");
    },
  });
}

export function useRegister(options?: { redirectTo?: string }) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      setUser(response.data.user);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push(options?.redirectTo ?? "/dashboard");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
      router.push("/login");
    },
  });
}

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery({
    queryKey: ["me"],
    queryFn: () => apiClient<ApiDataResponse<User>>("/me"),
    retry: false,
  });

  useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data.data);
    }
    if (query.isError) {
      setUser(null);
    }
  }, [query.isSuccess, query.isError, query.data, setUser]);

  return query;
}
