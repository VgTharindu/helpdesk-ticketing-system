'use client';

import { useDashboard } from "@/features/dashboard/hooks";
import { StatCards } from "@/features/dashboard/components/StatCards";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";
import { Skeleton } from "@/components/ui";
import { ErrorState } from "@/components/shared/ErrorState";

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboard();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text">Dashboard</h1>

      {isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-20" />
          ))}
        </div>
      )}

      {isError && <ErrorState message="Couldn't load the dashboard." onRetry={() => refetch()} />}

      {data && (
        <>
          <StatCards data={data.data} />
          <div>
            <h2 className="mb-3 text-lg font-medium text-text">Recent activity</h2>
            <RecentActivity items={data.data.recent_activity} />
          </div>
        </>
      )}
    </div>
  );
}