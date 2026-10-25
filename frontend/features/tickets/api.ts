import { apiClient } from "@/lib/api/client";
import type { ApiMessageResponse, Paginated, Ticket } from "@/lib/api/types";

export interface TicketListParams {
  "filter[status]"?: string;
  "filter[priority]"?: string;
  "filter[assigned]"?: string;
  "filter[search]"?: string;
  sort?: string;
  per_page?: number;
  page?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface CreateTicketPayload {
  subject: string;
  description: string;
  priority: "low" | "medium" | "high";
}

export function listTickets(params: TicketListParams) {
  return apiClient<Paginated<Ticket>>("/tickets", { params });
}

export function createTicket(payload: CreateTicketPayload) {
  return apiClient<ApiMessageResponse<Ticket>>("/tickets", { method: "POST", body: payload });
}