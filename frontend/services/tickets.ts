import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { apiClient } from "@/lib/api-client";
import type {
  ApiDataResponse,
  ApiMessageResponse,
  Assignment,
  ActivityItem,
  Paginated,
  Ticket,
  TicketReply,
} from "@/lib/types";

// Schemas (new ticket form + attachment limits)

// Same limits as the Laravel StoreTicketRequest
export const MAX_ATTACHMENTS = 3;
export const MAX_ATTACHMENT_SIZE = 3 * 1024 * 1024;
export const ALLOWED_ATTACHMENT_TYPES = ["image/jpeg", "image/png", "application/pdf"];
export const ATTACHMENT_ACCEPT = ".jpg,.jpeg,.png,.pdf";

export const createTicketSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(255, "Subject is too long"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high"], { message: "Select a priority" }),
  attachments: z
    .array(z.instanceof(File))
    .max(MAX_ATTACHMENTS, "You can attach up to 3 files.")
    .refine(
      (files) => files.every((file) => ALLOWED_ATTACHMENT_TYPES.includes(file.type)),
      "Each attachment must be a JPG, PNG or PDF file."
    )
    .refine(
      (files) => files.every((file) => file.size <= MAX_ATTACHMENT_SIZE),
      "Each attachment must be 3 MB or smaller."
    ),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;

// API calls

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
  attachments?: File[];
}

export interface AssignTicketPayload {
  agent_id: number;
  reason?: string;
}

export function listTickets(params: TicketListParams) {
  return apiClient<Paginated<Ticket>>("/tickets", { params });
}

export function createTicket(payload: CreateTicketPayload) {
  // Multipart form so files can be sent together with the text fields
  const formData = new FormData();
  formData.append("subject", payload.subject);
  formData.append("description", payload.description);
  formData.append("priority", payload.priority);
  payload.attachments?.forEach((file) => formData.append("attachments[]", file));

  return apiClient<ApiMessageResponse<Ticket>>("/tickets", { method: "POST", body: formData });
}

export function attachmentDownloadUrl(downloadPath: string) {
  return `/api/proxy${downloadPath}`;
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

// Hooks

export function useTickets(params: TicketListParams) {
  return useQuery({
    queryKey: ["tickets", params],
    queryFn: () => listTickets(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateTicket() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTicket,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      router.push(`/tickets/${response.data.id}`);
    },
  });
}

export function useTicket(id: number) {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getTicket(id),
  });
}

function invalidateTicket(queryClient: ReturnType<typeof useQueryClient>, id: number) {
  queryClient.invalidateQueries({ queryKey: ["ticket", id] });
  queryClient.invalidateQueries({ queryKey: ["tickets"] });
  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  queryClient.invalidateQueries({ queryKey: ["ticket-history", id] });
  queryClient.invalidateQueries({ queryKey: ["ticket-assignments", id] });
}

export function useClaimTicket(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => claimTicket(id),
    onSuccess: () => invalidateTicket(queryClient, id),
  });
}

export function useAssignTicket(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AssignTicketPayload) => assignTicket(id, payload),
    onSuccess: () => invalidateTicket(queryClient, id),
  });
}

export function useChangeStatus(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: string) => changeTicketStatus(id, status),
    onSuccess: () => invalidateTicket(queryClient, id),
  });
}

export function useReplies(id: number) {
  return useQuery({
    queryKey: ["ticket-replies", id],
    queryFn: () => listReplies(id),
  });
}

export function useCreateReply(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: string) => createReply(id, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-replies", id] });
      invalidateTicket(queryClient, id);
    },
  });
}

export function useTicketHistory(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ["ticket-history", id],
    queryFn: () => getTicketHistory(id),
    enabled,
  });
}

export function useTicketAssignments(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ["ticket-assignments", id],
    queryFn: () => getTicketAssignments(id),
    enabled,
  });
}
