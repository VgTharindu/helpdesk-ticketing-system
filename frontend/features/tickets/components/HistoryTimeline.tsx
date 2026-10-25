import { StatusBadge } from "@/components/ui";
import { EmptyState } from "@/components/shared/EmptyState";
import type { ActivityItem } from "@/lib/api/types";

export function HistoryTimeline({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return <EmptyState title="No history yet" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2 border-b border-border pb-3 text-sm last:border-0">
          <span className="font-medium text-text">{item.actor?.name ?? "System"}</span>
          {item.from_status && <StatusBadge status={item.from_status} />}
          {item.from_status && <span className="text-text-muted">→</span>}
          {item.to_status && <StatusBadge status={item.to_status} />}
          <span className="ml-auto text-xs text-text-muted">
            {new Date(item.at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      ))}
    </div>
  );
}