'use client';

import { useDashboard } from "@/services/dashboard";
import { StatCards } from "@/components/dashboard/StatCards";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Skeleton, ErrorState } from "@/components/ui";

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