'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  assignTicket,
  changeTicketStatus,
  claimTicket,
  createReply,
  createTicket,
  getTicket,
  getTicketAssignments,
  getTicketHistory,
  listReplies,
  listTickets,
  type AssignTicketPayload,
  type TicketListParams,
} from "./api";

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