"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/stores/use-auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const { institutionId, setInstitutionId, user } = useAuthStore();
  const [localInstitutionId, setLocalInstitutionId] = useState(
    institutionId ?? ""
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setInstitutionId(localInstitutionId.trim() || null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Institution and application settings.
        </p>
      </div>

      <div className="max-w-md space-y-6 rounded-lg border bg-card p-4">
        <div className="space-y-2">
          <h2 className="font-medium">Institution</h2>
          <label
            htmlFor="institutionId"
            className="text-sm text-muted-foreground"
          >
            Institution ID
          </label>
          <Input
            id="institutionId"
            value={localInstitutionId}
            onChange={(e) => setLocalInstitutionId(e.target.value)}
            placeholder="Enter institution UUID"
          />
          <p className="text-xs text-muted-foreground">
            Required for attendance and other institution-scoped features. Set
            after creating an institution or from your admin.
          </p>
          <Button size="sm" onClick={handleSave}>
            {saved ? "Saved" : "Save"}
          </Button>
        </div>

        {user && (
          <div className="space-y-1 border-t pt-4">
            <h2 className="font-medium">Current user</h2>
            <p className="text-sm text-muted-foreground">
              {user.name} ({user.email}) — {user.role}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
