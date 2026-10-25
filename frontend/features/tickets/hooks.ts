'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createTicket, listTickets, type TicketListParams } from "./api";

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