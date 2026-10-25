'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Input, Select } from "@/components/ui";
import { createStaffSchema, type CreateStaffFormValues } from "../schemas";
import { useCreateStaff } from "../hooks";
import { ApiError } from "@/lib/api/errors";

const ROLE_OPTIONS = [
  { value: "agent", label: "Agent" },
  { value: "admin", label: "Admin" },
];

interface CreateStaffDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateStaffDialog({ open, onClose }: CreateStaffDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStaffFormValues>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: { role: "agent" },
  });

  const createStaff = useCreateStaff();

  const onSubmit = (values: CreateStaffFormValues) => {
    createStaff.mutate(values, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Add staff member">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input placeholder="Full name" {...register("name")} error={errors.name?.message} />
        <Input type="email" placeholder="Email" {...register("email")} error={errors.email?.message} />
        <Input type="password" placeholder="Password" {...register("password")} error={errors.password?.message} />
        <Input
          type="password"
          placeholder="Confirm password"
          {...register("password_confirmation")}
          error={errors.password_confirmation?.message}
        />
        <Select options={ROLE_OPTIONS} {...register("role")} />

        {createStaff.isError && (
          <p className="text-sm text-danger">
            {createStaff.error instanceof ApiError ? createStaff.error.message : "Something went wrong."}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createStaff.isPending}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
}