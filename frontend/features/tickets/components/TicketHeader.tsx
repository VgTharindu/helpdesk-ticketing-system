'use client';

import { useState } from "react";
import { StatusBadge, PriorityBadge, Button } from "@/components/ui";
import { useAuthStore } from "@/stores/auth-store";
import { useClaimTicket, useChangeStatus } from "../hooks";
import { AssignDialog } from "./AssignDialog";
import type { Ticket } from "@/lib/api/types";

export function TicketHeader({ ticket }: { ticket: Ticket }) {
  const [assignOpen, setAssignOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const claimTicket = useClaimTicket(ticket.id);
  const changeStatus = useChangeStatus(ticket.id);

  const canClaim = hasPermission("claim tickets") && ticket.agent === null && ticket.status === "open";
  const canAssign = hasPermission("assign tickets") && ticket.status !== "resolved";
  const isMyTicket = ticket.agent?.id === user?.id;
  const canChangeStatus =
    (hasPermission("view all tickets") || (hasPermission("claim tickets") && isMyTicket)) &&
    ticket.status !== "resolved";

  return (
    <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-text-muted">#{ticket.id}</p>
          <h1 className="text-xl font-semibold text-text">{ticket.subject}</h1>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      <p className="text-sm text-text-muted">
        Customer: {ticket.customer?.name ?? "—"} · Agent: {ticket.agent?.name ?? "Unassigned"}
      </p>

      <p className="whitespace-pre-wrap text-sm text-text">{ticket.description}</p>

      <div className="flex flex-wrap gap-2 border-t border-border pt-3">
        {canClaim && (
          <Button size="sm" isLoading={claimTicket.isPending} onClick={() => claimTicket.mutate()}>
            Claim ticket
          </Button>
        )}

        {canAssign && (
          <Button size="sm" variant="secondary" onClick={() => setAssignOpen(true)}>
            {ticket.agent ? "Reassign" : "Assign"}
          </Button>
        )}

        {canChangeStatus && ticket.status === "in_progress" && (
          <Button
            size="sm"
            variant="secondary"
            isLoading={changeStatus.isPending}
            onClick={() => changeStatus.mutate("waiting_for_customer")}
          >
            Ask customer for info
          </Button>
        )}

        {canChangeStatus && ticket.status === "waiting_for_customer" && (
          <Button
            size="sm"
            variant="secondary"
            isLoading={changeStatus.isPending}
            onClick={() => changeStatus.mutate("in_progress")}
          >
            Back to in progress
          </Button>
        )}

        {canChangeStatus && (
          <Button
            size="sm"
            variant="danger"
            isLoading={changeStatus.isPending}
            onClick={() => {
              if (confirm("Mark this ticket as resolved?")) {
                changeStatus.mutate("resolved");
              }
            }}
          >
            Resolve
          </Button>
        )}
      </div>

      <AssignDialog ticketId={ticket.id} open={assignOpen} onClose={() => setAssignOpen(false)} />
    </div>
  );
}