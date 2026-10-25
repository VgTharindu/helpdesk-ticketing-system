import { Card, StatusBadge } from "@/components/ui";
import { EmptyState } from "@/components/shared/EmptyState";
import type { ActivityItem } from "@/lib/api/types";

function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return <EmptyState title="No activity yet" description="Updates on tickets will show up here." />;
  }

  return (
    <Card className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-text">{item.actor?.name ?? "Someone"}</span>
            <span className="text-text-muted">moved</span>
            <span className="text-text-muted">#{item.ticket.id}</span>
            {item.from_status && <StatusBadge status={item.from_status} />}
            {item.from_status && <span className="text-text-muted">→</span>}
            {item.to_status && <StatusBadge status={item.to_status} />}
          </div>
          <span className="shrink-0 text-xs text-text-muted">{formatRelativeTime(item.at)}</span>
        </div>
      ))}
    </Card>
  );
}