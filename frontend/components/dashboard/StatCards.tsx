import { Card } from "@/components/ui";
import type { DashboardData } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In progress",
  waiting_for_customer: "Waiting for customer",
  resolved: "Resolved",
};

const SCOPE_LABELS: Record<DashboardData["scope"], string> = {
  own: "your tickets",
  queue: "the ticket queue",
  all: "all tickets",
};

// One stat card with a coloured left border and number (colour comes from a CSS variable)
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card className="flex flex-col gap-1 border-l-4" style={{ borderLeftColor: color }}>
      <span className="text-xs font-medium text-text-muted">{label}</span>
      <span className="text-2xl font-semibold" style={{ color }}>
        {value}
      </span>
    </Card>
  );
}

export function StatCards({ data }: { data: DashboardData }) {
  return (
    <div>
      <p className="mb-3 text-sm text-text-muted">Showing {SCOPE_LABELS[data.scope]}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total" value={data.counts.total} color="var(--color-primary)" />

        {Object.entries(data.counts.by_status).map(([status, count]) => (
          <StatCard
            key={status}
            label={STATUS_LABELS[status] ?? status}
            value={count}
            color={`var(--color-status-${status}-fg)`}
          />
        ))}

        <StatCard label="Unassigned" value={data.counts.unassigned} color="var(--color-stat-unassigned)" />

        {data.counts.assigned_to_me !== null && (
          <StatCard label="Assigned to me" value={data.counts.assigned_to_me} color="var(--color-stat-mine)" />
        )}
      </div>
    </div>
  );
}