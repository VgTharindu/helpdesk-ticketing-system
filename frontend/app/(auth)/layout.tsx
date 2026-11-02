import { LifeBuoy } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4">
      {/* Brand shown above the login / register card */}
      <div className="flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-card bg-primary text-primary-foreground">
          <LifeBuoy size={22} />
        </span>
        <span className="text-2xl font-bold tracking-tight text-primary">Helpdesk</span>
      </div>
      {children}
    </div>
  );
}