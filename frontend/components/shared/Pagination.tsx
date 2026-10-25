'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import type { PaginationMeta } from "@/lib/api/types";

export function Pagination({ meta }: { meta: PaginationMeta }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`/tickets?${params.toString()}`);
  }

  if (meta.last_page <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-sm text-text-muted">
        Page {meta.current_page} of {meta.last_page} ({meta.total} total)
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={meta.current_page <= 1}
          onClick={() => goToPage(meta.current_page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={meta.current_page >= meta.last_page}
          onClick={() => goToPage(meta.current_page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}