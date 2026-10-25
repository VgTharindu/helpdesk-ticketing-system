import { cn } from "@/utils/cn";
import { EmptyState } from "@/components/shared/EmptyState";
import type { TicketReply } from "@/lib/api/types";

function formatTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ConversationThread({ replies }: { replies: TicketReply[] }) {
  if (replies.length === 0) {
    return <EmptyState title="No replies yet" description="Start the conversation below." />;
  }

  return (
    <div className="flex flex-col gap-3">
      {replies.map((reply) => (
        <div
          key={reply.id}
          className={cn(
            "max-w-[85%] rounded-card border border-border p-3",
            reply.author.role === "customer" ? "self-start bg-surface" : "self-end bg-primary-soft"
          )}
        >
          <div className="mb-1 flex items-center justify-between gap-4 text-xs text-text-muted">
            <span className="font-medium text-text">{reply.author.name}</span>
            <span>{formatTime(reply.created_at)}</span>
          </div>
          <p className="whitespace-pre-wrap text-sm text-text">{reply.message}</p>
        </div>
      ))}
    </div>
  );
}