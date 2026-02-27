"use client";

import { Users } from "lucide-react";
import { EmptyState } from "@/components/empty-states";

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">
          Manage student records and profiles.
        </p>
      </div>
      <EmptyState
        icon={Users}
        title="Coming soon"
        description="Student management API is not yet available. This screen will list, add, and edit students when the backend supports it."
      />
    </div>
  );
}
