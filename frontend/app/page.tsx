import { Button, Input, Card, StatusBadge, PriorityBadge, Skeleton, Spinner } from "@/components/ui";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">F1 component check</h1>
        <ThemeToggle />
      </div>

      <Card className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button isLoading>Loading</Button>
        </div>

        <Input placeholder="Email" />
        <Input placeholder="With error" error="This field is required" />

        <div className="flex gap-2">
          <StatusBadge status="open" />
          <StatusBadge status="in_progress" />
          <StatusBadge status="waiting_for_customer" />
          <StatusBadge status="resolved" />
        </div>

        <div className="flex gap-3">
          <PriorityBadge priority="low" />
          <PriorityBadge priority="medium" />
          <PriorityBadge priority="high" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-32" />
          <Spinner />
        </div>
      </Card>
    </main>
  );
}