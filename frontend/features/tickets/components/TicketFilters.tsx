'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input, Select } from "@/components/ui";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuthStore } from "@/stores/auth-store";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "waiting_for_customer", label: "Waiting for customer" },
  { value: "resolved", label: "Resolved" },
];

const PRIORITY_OPTIONS = [
  { value: "", label: "All priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const ASSIGNED_OPTIONS = [
  { value: "", label: "All tickets" },
  { value: "me", label: "Assigned to me" },
  { value: "unassigned", label: "Unassigned" },
];

const SORT_OPTIONS = [
  { value: "-created_at", label: "Newest first" },
  { value: "created_at", label: "Oldest first" },
];

export function TicketFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const showAssignedFilter = hasPermission("view ticket queue") || hasPermission("view all tickets");

  const [searchInput, setSearchInput] = useState(searchParams.get("filter[search]") ?? "");
  const debouncedSearch = useDebounce(searchInput, 400);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.replace(`/tickets?${params.toString()}`);
  }

  useEffect(() => {
    if (debouncedSearch !== (searchParams.get("filter[search]") ?? "")) {
      updateParam("filter[search]", debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className="flex flex-wrap gap-3">
      <Input
        placeholder="Search tickets..."
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        className="w-full sm:w-64"
      />
      <Select
        options={STATUS_OPTIONS}
        value={searchParams.get("filter[status]") ?? ""}
        onChange={(event) => updateParam("filter[status]", event.target.value)}
      />
      <Select
        options={PRIORITY_OPTIONS}
        value={searchParams.get("filter[priority]") ?? ""}
        onChange={(event) => updateParam("filter[priority]", event.target.value)}
      />
      {showAssignedFilter && (
        <Select
          options={ASSIGNED_OPTIONS}
          value={searchParams.get("filter[assigned]") ?? ""}
          onChange={(event) => updateParam("filter[assigned]", event.target.value)}
        />
      )}
      <Select
        options={SORT_OPTIONS}
        value={searchParams.get("sort") ?? "-created_at"}
        onChange={(event) => updateParam("sort", event.target.value)}
      />
    </div>
  );
}