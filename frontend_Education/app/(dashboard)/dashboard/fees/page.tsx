"use client";

import { Wallet } from "lucide-react";
import { EmptyState } from "@/components/empty-states";

export default function FeesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fees</h1>
        <p className="text-muted-foreground">
          Manage fee collection and records.
        </p>
      </div>
      <EmptyState
        icon={Wallet}
        title="Coming soon"
        description="Fees API is not yet available. This screen will manage fee collection when the backend supports it."
      />
    </div>
  );
}
