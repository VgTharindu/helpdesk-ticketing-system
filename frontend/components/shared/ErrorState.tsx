import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Something went wrong.", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-border bg-surface py-12 text-center">
      <AlertTriangle className="text-danger" size={28} />
      <p className="text-sm text-text">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}