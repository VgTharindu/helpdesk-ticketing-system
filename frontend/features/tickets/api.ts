import { apiClient } from "@/lib/api/client";
import type {
  ApiDataResponse,
  ApiMessageResponse,
  Assignment,
  ActivityItem,
  Paginated,
  Ticket,
  TicketReply,
} from "@/lib/api/types";

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

export interface AssignTicketPayload {
  agent_id: number;
  reason?: string;
}

export function listTickets(params: TicketListParams) {
  return apiClient<Paginated<Ticket>>("/tickets", { params });
}

export function createTicket(payload: CreateTicketPayload) {
  return apiClient<ApiMessageResponse<Ticket>>("/tickets", { method: "POST", body: payload });
}

export function getTicket(id: number) {
  return apiClient<ApiDataResponse<Ticket>>(`/tickets/${id}`);
}

export function claimTicket(id: number) {
  return apiClient<ApiMessageResponse<Ticket>>(`/tickets/${id}/claim`, { method: "POST" });
}

export function assignTicket(id: number, payload: AssignTicketPayload) {
  return apiClient<ApiMessageResponse<Ticket>>(`/tickets/${id}/assign`, { method: "POST", body: payload });
}

export function changeTicketStatus(id: number, status: string) {
  return apiClient<ApiMessageResponse<Ticket>>(`/tickets/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function listReplies(id: number) {
  return apiClient<ApiDataResponse<TicketReply[]>>(`/tickets/${id}/replies`);
}

export function createReply(id: number, message: string) {
  return apiClient<ApiMessageResponse<TicketReply>>(`/tickets/${id}/replies`, {
    method: "POST",
    body: { message },
  });
}

export function getTicketHistory(id: number) {
  return apiClient<ApiDataResponse<ActivityItem[]>>(`/tickets/${id}/history`);
}

export function getTicketAssignments(id: number) {
  return apiClient<ApiDataResponse<Assignment[]>>(`/tickets/${id}/assignments`);
}