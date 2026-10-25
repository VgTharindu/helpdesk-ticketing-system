'use client';

import { useAuthStore } from "@/stores/auth-store";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text">Dashboard</h1>
      <p className="mt-2 text-text-muted">
        Logged in as {user?.name} ({user?.role})
      </p>
    </div>
  );
}