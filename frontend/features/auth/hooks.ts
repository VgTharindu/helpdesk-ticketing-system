'use client';

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { login, register, logout as logoutRequest } from "./api";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiDataResponse, User } from "@/lib/api/types";

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
    mutationFn: logoutRequest,
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