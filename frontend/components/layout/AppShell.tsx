'use client';

import { useCurrentUser } from "@/features/auth/hooks";
import { useAuthStore } from "@/stores/auth-store";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Spinner } from "@/components/ui";

export function AppShell({ children }: { children: React.ReactNode }) {
  useCurrentUser();
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}