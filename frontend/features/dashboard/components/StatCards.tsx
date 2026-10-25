import { Card } from "@/components/ui";
import type { DashboardData } from "@/lib/api/types";
import { cn } from "@/utils/cn";

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

export function StatCards({ data }: { data: DashboardData }) {
  return (
    <div>
      <p className="mb-3 text-sm text-text-muted">Showing {SCOPE_LABELS[data.scope]}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Card className="flex flex-col gap-1">
          <span className="text-xs text-text-muted">Total</span>
          <span className="text-2xl font-semibold text-text">{data.counts.total}</span>
        </Card>

        {Object.entries(data.counts.by_status).map(([status, count]) => (
          <Card key={status} className="flex flex-col gap-1">
            <span className="text-xs text-text-muted">{STATUS_LABELS[status] ?? status}</span>
            <span className="text-2xl font-semibold text-text">{count}</span>
          </Card>
        ))}

        <Card className="flex flex-col gap-1">
          <span className="text-xs text-text-muted">Unassigned</span>
          <span className="text-2xl font-semibold text-text">{data.counts.unassigned}</span>
        </Card>

        {data.counts.assigned_to_me !== null && (
          <Card className={cn("flex flex-col gap-1")}>
            <span className="text-xs text-text-muted">Assigned to me</span>
            <span className="text-2xl font-semibold text-text">{data.counts.assigned_to_me}</span>
          </Card>
        )}
      </div>
    </div>
  );
}