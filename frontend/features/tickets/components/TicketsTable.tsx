import Link from "next/link";
import { StatusBadge, PriorityBadge } from "@/components/ui";
import type { Ticket } from "@/lib/api/types";

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function TicketsTable({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border text-xs text-text-muted">
          <tr>
            <th className="px-4 py-3">Subject</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Agent</th>
            <th className="px-4 py-3">Updated</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="border-b border-border last:border-0 hover:bg-background">
              <td className="px-4 py-3">
                <Link href={`/tickets/${ticket.id}`} className="font-medium text-text hover:text-primary">
                  #{ticket.id} {ticket.subject}
                </Link>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={ticket.priority} />
              </td>
              <td className="px-4 py-3 text-text-muted">{ticket.customer?.name ?? "—"}</td>
              <td className="px-4 py-3 text-text-muted">{ticket.agent?.name ?? "Unassigned"}</td>
              <td className="px-4 py-3 text-text-muted">{formatDate(ticket.updated_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}