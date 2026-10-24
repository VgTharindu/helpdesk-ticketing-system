import { ApiError } from "./errors";

type QueryParams = Record<string, string | number | boolean | undefined>;

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  params?: QueryParams;
}

function buildPath(path: string, params?: QueryParams): string {
  const query = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        query.set(key, String(value));
      }
    });
  }

  const queryString = query.toString();
  return queryString ? `/api/proxy${path}?${queryString}` : `/api/proxy${path}`;
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, params } = options;

  const response = await fetch(buildPath(path, params), {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      json?.message ?? "Something went wrong. Please try again.",
      json?.errors
    );
  }

  return json as T;
}