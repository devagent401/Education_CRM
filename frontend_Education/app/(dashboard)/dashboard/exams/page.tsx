"use client";

import { FileQuestion } from "lucide-react";
import { EmptyState } from "@/components/empty-states";

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Exams</h1>
        <p className="text-muted-foreground">
          Manage exams and results.
        </p>
      </div>
      <EmptyState
        icon={FileQuestion}
        title="Coming soon"
        description="Exams API is not yet available. This screen will manage exams and results when the backend supports it."
      />
    </div>
  );
}
