'use client';

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTickets, type TicketListParams } from "@/services/tickets";
import { TicketFilters } from "@/components/tickets/TicketFilters";
import { TicketsTable } from "@/components/tickets/TicketsTable";
import { Pagination, EmptyState, ErrorState, Skeleton, Spinner } from "@/components/ui";

function TicketsContent() {
  const searchParams = useSearchParams();

  const params: TicketListParams = {
    "filter[status]": searchParams.get("filter[status]") ?? undefined,
    "filter[priority]": searchParams.get("filter[priority]") ?? undefined,
    "filter[assigned]": searchParams.get("filter[assigned]") ?? undefined,
    "filter[search]": searchParams.get("filter[search]") ?? undefined,
    sort: searchParams.get("sort") ?? "-created_at",
    per_page: 15,
    page: Number(searchParams.get("page") ?? "1"),
  };

  const { data, isLoading, isError, refetch } = useTickets(params);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-text">Tickets</h1>

      <TicketFilters />

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14" />
          ))}
        </div>
      )}

      {isError && <ErrorState message="Couldn't load tickets." onRetry={() => refetch()} />}

      {data && data.data.length === 0 && (
        <EmptyState title="No tickets match your filters" description="Try adjusting your search or filters." />
      )}

      {data && data.data.length > 0 && (
        <>
          <TicketsTable tickets={data.data} />
          <Pagination meta={data.meta} />
        </>
      )}
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <TicketsContent />
    </Suspense>
  );
}