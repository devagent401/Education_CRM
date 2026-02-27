"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function ManageHomepagePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Homepage</h1>
      <p className="mt-1 text-muted-foreground">
        Customize hero, highlights, and featured content.
      </p>
      <div className="mt-8 space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold">Hero Section</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Edit headline, subheadline, and CTA buttons.
            </p>
            <button className="mt-4 text-sm text-primary hover:underline">Configure</button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold">Stats</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Update counters (years, alumni, programs, faculty).
            </p>
            <button className="mt-4 text-sm text-primary hover:underline">Configure</button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
