"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-muted-foreground">
        Institution and application settings.
      </p>
      <div className="mt-8 max-w-md space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Institution Name</label>
          <Input placeholder="Edu Institution" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Contact Email</label>
          <Input type="email" placeholder="contact@edu.edu" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <Input placeholder="123 Education Lane" />
        </div>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
