import { ApiError } from "@/lib/api/errors";
import type { ApiDataResponse, User } from "@/lib/api/types";

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