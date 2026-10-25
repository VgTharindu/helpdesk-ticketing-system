'use client';

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { createTicketSchema, type CreateTicketFormValues } from "@/features/tickets/schemas";
import { useCreateTicket } from "@/features/tickets/hooks";
import { Button, Input, Textarea, Select, Card } from "@/components/ui";
import { ApiError } from "@/lib/api/errors";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function NewTicketPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: { priority: "medium" },
  });

  const createTicket = useCreateTicket();

  const onSubmit = (values: CreateTicketFormValues) => {
    createTicket.mutate(values);
  };

  return (
    <div className="flex flex-col gap-4">
      <Link href="/tickets" className="flex w-fit items-center gap-1 text-sm text-text-muted hover:text-text">
        <ArrowLeft size={14} />
        Back to tickets
      </Link>

      <Card className="max-w-xl">
        <h1 className="mb-6 text-xl font-semibold text-text">New ticket</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Subject</label>
            <Input placeholder="Briefly describe the issue" {...register("subject")} error={errors.subject?.message} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text">Description</label>
            <Textarea
              rows={5}
              placeholder="Add as much detail as you can"
              {...register("description")}
              error={errors.description?.message}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text">Priority</label>
            <Select options={PRIORITY_OPTIONS} {...register("priority")} />
            {errors.priority && <p className="mt-1 text-xs text-danger">{errors.priority.message}</p>}
          </div>

          {createTicket.isError && (
            <p className="text-sm text-danger">
              {createTicket.error instanceof ApiError ? createTicket.error.message : "Something went wrong."}
            </p>
          )}

          <Button type="submit" isLoading={createTicket.isPending}>
            Create ticket
          </Button>
        </form>
      </Card>
    </div>
  );
}