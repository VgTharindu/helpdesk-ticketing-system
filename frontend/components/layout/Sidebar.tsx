'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Ticket, PlusCircle, Users } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/utils/cn";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: null },
  { href: "/tickets", label: "Tickets", icon: Ticket, permission: null },
  { href: "/tickets/new", label: "New ticket", icon: PlusCircle, permission: "create tickets" },
  { href: "/admin/users", label: "Users", icon: Users, permission: "manage users" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const visibleItems = NAV_ITEMS.filter((item) => !item.permission || hasPermission(item.permission));

  return (
    <aside className="hidden w-60 flex-col border-r border-border bg-surface p-4 md:flex">
      <p className="mb-6 px-2 text-lg font-semibold text-text">Helpdesk</p>
      <nav className="flex flex-col gap-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-control px-3 py-2 text-sm font-medium text-text-muted hover:bg-background",
                isActive && "bg-primary-soft text-primary"
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}