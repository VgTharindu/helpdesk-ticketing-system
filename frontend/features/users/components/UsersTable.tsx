'use client';

import { Badge, Select } from "@/components/ui";
import { useAuthStore } from "@/stores/auth-store";
import { useChangeRole } from "../hooks";
import type { User } from "@/lib/api/types";

const ROLE_OPTIONS = [
  { value: "customer", label: "Customer" },
  { value: "agent", label: "Agent" },
  { value: "admin", label: "Admin" },
];

const ROLE_BADGE_COLOR: Record<string, string> = {
  customer: "text-text-muted",
  agent: "text-primary",
  admin: "text-danger",
};

export function UsersTable({ users }: { users: User[] }) {
  const currentUser = useAuthStore((state) => state.user);
  const changeRole = useChangeRole();

  function handleRoleChange(user: User, newRole: string) {
    if (newRole === user.role) return;

    if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return;

    changeRole.mutate({ userId: user.id, role: newRole });
  }

  return (
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border text-xs text-text-muted">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = user.id === currentUser?.id;
            return (
              <tr key={user.id} className="border-b border-border last:border-0 hover:bg-background">
                <td className="px-4 py-3 font-medium text-text">{user.name}</td>
                <td className="px-4 py-3 text-text-muted">{user.email}</td>
                <td className="px-4 py-3">
                  {isSelf ? (
                    <Badge className={ROLE_BADGE_COLOR[user.role]}>{user.role} (you)</Badge>
                  ) : (
                    <Select
                      options={ROLE_OPTIONS}
                      value={user.role}
                      onChange={(event) => handleRoleChange(user, event.target.value)}
                      disabled={changeRole.isPending}
                      className="h-8 text-xs"
                    />
                  )}
                </td>
                <td className="px-4 py-3 text-text-muted">{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}