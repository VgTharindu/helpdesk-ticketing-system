import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { AppNotification, NotificationType, Paginated } from "@/lib/types";

// Shared labels so the toast and the bell list read the same
export const NOTIFICATION_TITLES: Record<NotificationType, string> = {
  ticket_replied: "New reply",
  ticket_assigned: "Ticket assigned to you",
  ticket_resolved: "Ticket resolved",
  new_ticket: "New ticket in the queue",
};

export type NotificationList = Paginated<AppNotification> & { unread_count: number };

// API calls

export function listNotifications(perPage = 10) {
  return apiClient<NotificationList>("/notifications", { params: { per_page: perPage } });
}

export function markNotificationAsRead(id: string) {
  return apiClient<{ message: string }>(`/notifications/${id}/read`, { method: "PATCH" });
}

export function markAllNotificationsAsRead() {
  return apiClient<{ message: string }>("/notifications/read-all", { method: "POST" });
}

// Hooks

export function useNotifications(enabled = true) {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => listNotifications(),
    enabled,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
