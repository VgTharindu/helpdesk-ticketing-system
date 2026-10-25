'use client';

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTicket, useReplies, useTicketHistory, useTicketAssignments } from "@/features/tickets/hooks";
import { TicketHeader } from "@/features/tickets/components/TicketHeader";
import { ConversationThread } from "@/features/tickets/components/ConversationThread";
import { ReplyForm } from "@/features/tickets/components/ReplyForm";
import { HistoryTimeline } from "@/features/tickets/components/HistoryTimeline";
import { AssignmentsTable } from "@/features/tickets/components/AssignmentsTable";
import { Skeleton, Card } from "@/components/ui";
import { ErrorState } from "@/components/shared/ErrorState";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/utils/cn";

type Tab = "conversation" | "history" | "assignments";

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const ticketId = Number(id);
  const [tab, setTab] = useState<Tab>("conversation");

  const hasPermission = useAuthStore((state) => state.hasPermission);
  const canSeeAssignments = hasPermission("view ticket queue") || hasPermission("view all tickets");

  const ticketQuery = useTicket(ticketId);
  const repliesQuery = useReplies(ticketId);
  const historyQuery = useTicketHistory(ticketId, tab === "history");
  const assignmentsQuery = useTicketAssignments(ticketId, canSeeAssignments && tab === "assignments");

  if (ticketQuery.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (ticketQuery.isError || !ticketQuery.data) {
    return <ErrorState message="Couldn't load this ticket." onRetry={() => ticketQuery.refetch()} />;
  }

  const ticket = ticketQuery.data.data;

  const tabs: { key: Tab; label: string }[] = [
    { key: "conversation", label: "Conversation" },
    { key: "history", label: "Status history" },
    ...(canSeeAssignments ? [{ key: "assignments" as Tab, label: "Assignments" }] : []),
  ];

  return (
    <div className="flex flex-col gap-4">
      <Link href="/tickets" className="flex w-fit items-center gap-1 text-sm text-text-muted hover:text-text">
        <ArrowLeft size={14} />
        Back to tickets
      </Link>

      <TicketHeader ticket={ticket} />

      <div className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "px-3 py-2 text-sm font-medium text-text-muted hover:text-text",
              tab === t.key && "border-b-2 border-primary text-primary"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "conversation" && (
        <Card className="flex flex-col gap-4">
          {repliesQuery.isLoading && <Skeleton className="h-24" />}
          {repliesQuery.isError && (
            <ErrorState message="Couldn't load the conversation." onRetry={() => repliesQuery.refetch()} />
          )}
          {repliesQuery.data && <ConversationThread replies={repliesQuery.data.data} />}
          {ticket.status !== "resolved" ? (
            <ReplyForm ticketId={ticket.id} />
          ) : (
            <p className="text-sm text-text-muted">This ticket is resolved. New replies are not allowed.</p>
          )}
        </Card>
      )}

      {tab === "history" && (
        <Card>
          {historyQuery.isLoading && <Skeleton className="h-24" />}
          {historyQuery.isError && (
            <ErrorState message="Couldn't load the history." onRetry={() => historyQuery.refetch()} />
          )}
          {historyQuery.data && <HistoryTimeline items={historyQuery.data.data} />}
        </Card>
      )}

      {tab === "assignments" && canSeeAssignments && (
        <Card>
          {assignmentsQuery.isLoading && <Skeleton className="h-24" />}
          {assignmentsQuery.isError && (
            <ErrorState message="Couldn't load assignments." onRetry={() => assignmentsQuery.refetch()} />
          )}
          {assignmentsQuery.data && <AssignmentsTable assignments={assignmentsQuery.data.data} />}
        </Card>
      )}
    </div>
  );
}