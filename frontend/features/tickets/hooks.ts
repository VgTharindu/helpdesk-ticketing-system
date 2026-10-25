'use client';

import { useQuery } from "@tanstack/react-query";
import { listTickets, type TicketListParams } from "./api";

export function useTickets(params: TicketListParams) {
  return useQuery({
    queryKey: ["tickets", params],
    queryFn: () => listTickets(params),
    placeholderData: (previousData) => previousData,
  });
}