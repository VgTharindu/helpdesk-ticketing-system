'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/lib/auth-store";
import {
  NOTIFICATION_TITLES,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "@/services/notifications";
import { Button, EmptyState, Spinner } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/lib/types";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => Boolean(state.user));

  const notifications = useNotifications(isLoggedIn);
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const unreadCount = notifications.data?.unread_count ?? 0;
  const items = notifications.data?.data ?? [];

  const openTicket = (item: AppNotification) => {
    setOpen(false);

    if (!item.read_at) {
      markAsRead.mutate(item.id);
    }

    router.push(`/tickets/${item.data.ticket_id}`);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        className="relative rounded-md p-2 text-text-muted transition-colors hover:bg-background hover:text-text"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-card border border-border bg-surface shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <span className="text-sm font-medium text-text">Notifications</span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAllAsRead.mutate()}
                  isLoading={markAllAsRead.isPending}
                >
                  <CheckCheck size={14} />
                  Mark all read
                </Button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.isLoading && (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              )}

              {!notifications.isLoading && items.length === 0 && (
                <EmptyState title="No notifications yet" />
              )}

              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openTicket(item)}
                  className={cn(
                    "flex w-full flex-col gap-1 border-b border-border px-4 py-3 text-left transition-colors last:border-0 hover:bg-background",
                    !item.read_at && "bg-background"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {!item.read_at && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    <span className="text-sm font-medium text-text">
                      {NOTIFICATION_TITLES[item.data.type] ?? "Notification"}
                    </span>
                    <span className="ml-auto shrink-0 text-xs text-text-muted">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  <span className="truncate text-xs text-text-muted">
                    #{item.data.ticket_id} {item.data.ticket_subject}
                  </span>

                  {item.data.preview && (
                    <span className="truncate text-xs text-text-muted">{item.data.preview}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
