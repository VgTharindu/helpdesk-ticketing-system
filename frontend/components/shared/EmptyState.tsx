import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-card border border-dashed border-border py-12 text-center">
      <Inbox className="text-text-muted" size={28} />
      <p className="text-sm font-medium text-text">{title}</p>
      {description && <p className="text-sm text-text-muted">{description}</p>}
      {action}
    </div>
  );
}