"use client";

import { GraduationCap } from "lucide-react";
import { EmptyState } from "@/components/empty-states";

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
        <p className="text-muted-foreground">
          Manage teacher records and assignments.
        </p>
      </div>
      <EmptyState
        icon={GraduationCap}
        title="Coming soon"
        description="Teacher management API is not yet available. This screen will list and manage teachers when the backend supports it."
      />
    </div>
  );
}
