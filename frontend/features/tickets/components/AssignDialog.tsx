'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Modal, Button, Select, Input } from "@/components/ui";
import { useAssignTicket } from "../hooks";
import type { Paginated, User } from "@/lib/api/types";

interface AssignDialogProps {
  ticketId: number;
  open: boolean;
  onClose: () => void;
}

export function AssignDialog({ ticketId, open, onClose }: AssignDialogProps) {
  const [agentId, setAgentId] = useState("");
  const [reason, setReason] = useState("");
  const assignTicket = useAssignTicket(ticketId);

  const agentsQuery = useQuery({
    queryKey: ["admin-users", "agent"],
    queryFn: () => apiClient<Paginated<User>>("/admin/users", { params: { role: "agent", per_page: 50 } }),
    enabled: open,
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!agentId) return;

    assignTicket.mutate(
      { agent_id: Number(agentId), reason: reason || undefined },
      {
        onSuccess: () => {
          onClose();
          setAgentId("");
          setReason("");
        },
      }
    );
  }

  const agentOptions = [
    { value: "", label: "Select an agent" },
    ...(agentsQuery.data?.data.map((agent) => ({ value: String(agent.id), label: agent.name })) ?? []),
  ];

  return (
    <Modal open={open} onClose={onClose} title="Assign ticket">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          value={agentId}
          onChange={(event) => setAgentId(event.target.value)}
          options={agentOptions}
          disabled={agentsQuery.isLoading}
        />
        <Input
          placeholder="Reason (optional)"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
        {assignTicket.isError && <p className="text-sm text-danger">Could not assign the ticket.</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={assignTicket.isPending} disabled={!agentId}>
            Assign
          </Button>
        </div>
      </form>
    </Modal>
  );
}