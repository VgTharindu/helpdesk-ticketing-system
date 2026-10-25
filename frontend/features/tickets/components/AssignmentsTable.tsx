import { EmptyState } from "@/components/shared/EmptyState";
import type { Assignment } from "@/lib/api/types";

const TYPE_LABELS: Record<Assignment["type"], string> = {
  claim: "Claimed",
  assigned: "Assigned",
  reassigned: "Reassigned",
};

export function AssignmentsTable({ assignments }: { assignments: Assignment[] }) {
  if (assignments.length === 0) {
    return <EmptyState title="No assignment history" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {assignments.map((assignment) => (
        <div key={assignment.id} className="rounded-card border border-border p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-text">
              {TYPE_LABELS[assignment.type]} to {assignment.agent.name}
            </span>
            {assignment.is_current && <span className="text-xs text-success">Current</span>}
          </div>
          <p className="mt-1 text-xs text-text-muted">
            By {assignment.assigned_by?.name ?? "—"} · {new Date(assignment.assigned_at).toLocaleDateString()}
          </p>
          {assignment.reason && <p className="mt-1 text-xs text-text-muted">Reason: {assignment.reason}</p>}
        </div>
      ))}
    </div>
  );
}