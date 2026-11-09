'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { disconnectEcho, getEcho } from "@/lib/echo";
import { useAuthStore } from "@/lib/auth-store";
import { NOTIFICATION_TITLES } from "@/services/notifications";
import type { BroadcastNotification } from "@/lib/types";

// Opens the websocket once a user is known and closes it on logout
export function EchoProvider({ children }: { children: React.ReactNode }) {
  const userId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      return;
    }

    const echo = getEcho();

    if (!echo) {
      return;
    }

    const connection = echo.connector.pusher.connection;
    const log = (state: { previous: string; current: string }) =>
      console.log(`[echo] ${state.previous} -> ${state.current}`);

    connection.bind("state_change", log);

    const channelName = `App.Models.User.${userId}`;
    const channel = echo.private(channelName);

    channel.subscribed(() => console.log(`[echo] subscribed to ${channelName}`));
    channel.error((error: unknown) => console.error("[echo] subscription error", error));

    channel.notification((payload: BroadcastNotification) => {
      console.log("[echo] notification", payload);

      toast(NOTIFICATION_TITLES[payload.type] ?? "Notification", {
        description: `#${payload.ticket_id} ${payload.ticket_subject}`,
        action: {
          label: "Open",
          onClick: () => router.push(`/tickets/${payload.ticket_id}`),
        },
      });

      // Everything this notification could have changed is now stale
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["ticket", payload.ticket_id] });
      queryClient.invalidateQueries({ queryKey: ["ticket-replies", payload.ticket_id] });
      queryClient.invalidateQueries({ queryKey: ["ticket-history", payload.ticket_id] });
    });

    return () => {
      connection.unbind("state_change", log);
      echo.leave(channelName);
    };
  }, [userId, queryClient, router]);

  // Drop the connection entirely once nobody is logged in
  useEffect(() => {
    if (userId) {
      return;
    }

    disconnectEcho();
  }, [userId]);

  return <>{children}</>;
}
