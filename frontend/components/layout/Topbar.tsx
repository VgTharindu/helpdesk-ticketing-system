'use client';

import { LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useLogout } from "@/features/auth/hooks";
import { Button } from "@/components/ui";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";

export function Topbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 sm:px-6">
      <MobileNav />
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <span className="hidden text-sm text-text-muted sm:inline">{user?.name}</span>
        <Button variant="ghost" size="sm" onClick={() => logout.mutate()} isLoading={logout.isPending}>
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}