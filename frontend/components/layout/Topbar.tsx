'use client';

import { LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useLogout } from "@/features/auth/hooks";
import { Button } from "@/components/ui";
import { ThemeToggle } from "./ThemeToggle";

export function Topbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
      <div />
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <span className="text-sm text-text-muted">{user?.name}</span>
        <Button variant="ghost" size="sm" onClick={() => logout.mutate()} isLoading={logout.isPending}>
          <LogOut size={14} />
          Logout
        </Button>
      </div>
    </header>
  );
}