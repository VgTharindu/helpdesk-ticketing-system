'use client';

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUsers } from "@/features/users/hooks";
import { UsersTable } from "@/features/users/components/UsersTable";
import { CreateStaffDialog } from "@/features/users/components/CreateStaffDialog";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button, Select, Skeleton, Spinner } from "@/components/ui";

const ROLE_FILTER_OPTIONS = [
  { value: "", label: "All roles" },
  { value: "customer", label: "Customers" },
  { value: "agent", label: "Agents" },
  { value: "admin", label: "Admins" },
];

function UsersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);

  const role = searchParams.get("role") ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  const { data, isLoading, isError, refetch } = useUsers({
    role: role || undefined,
    per_page: 15,
    page,
  });

  function updateRoleFilter(newRole: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (newRole) {
      params.set("role", newRole);
    } else {
      params.delete("role");
    }
    params.delete("page");
    router.replace(`/admin/users?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-text">Users</h1>
        <Button onClick={() => setDialogOpen(true)}>Add staff</Button>
      </div>

      <Select
        options={ROLE_FILTER_OPTIONS}
        value={role}
        onChange={(event) => updateRoleFilter(event.target.value)}
        className="w-48"
      />

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12" />
          ))}
        </div>
      )}

      {isError && <ErrorState message="Couldn't load users." onRetry={() => refetch()} />}

      {data && data.data.length === 0 && <EmptyState title="No users found" />}

      {data && data.data.length > 0 && (
        <>
          <UsersTable users={data.data} />
          <Pagination meta={data.meta} />
        </>
      )}

      <CreateStaffDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <UsersContent />
    </Suspense>
  );
}