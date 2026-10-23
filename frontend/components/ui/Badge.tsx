import { cn } from "@/utils/cn";

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In progress",
  waiting_for_customer: "Waiting for customer",
  resolved: "Resolved",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: `var(--color-status-${status}-bg)`,
        color: `var(--color-status-${status}-fg)`,
      }}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

const PRIORITY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium"
      style={{ color: `var(--color-priority-${priority})` }}
    >
      ● {PRIORITY_LABELS[priority] ?? priority}
    </span>
  );
}

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-text-muted", className)}>
      {children}
    </span>
  );
}