'use client';

import { useState } from "react";
import { Button, Textarea } from "@/components/ui";
import { useCreateReply } from "../hooks";

export function ReplyForm({ ticketId }: { ticketId: number }) {
  const [message, setMessage] = useState("");
  const createReply = useCreateReply(ticketId);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;

    createReply.mutate(message, {
      onSuccess: () => setMessage(""),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Textarea
        rows={3}
        placeholder="Write a reply..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      {createReply.isError && <p className="text-sm text-danger">Couldn&apos;t send the reply.</p>}
      <Button type="submit" size="sm" isLoading={createReply.isPending} disabled={!message.trim()}>
        Send reply
      </Button>
    </form>
  );
}