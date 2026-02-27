"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/stores/auth-store";
import { attendanceService } from "@/services/attendance.service";
import { ApiError } from "@/lib/api/client";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

export default function AttendancePage() {
  const institutionId = useAuthStore((s) => s.institutionId);
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<"PRESENT" | "ABSENT" | "LATE" | "EXCUSED" | "LEAVE">("PRESENT");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!institutionId) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="mt-1 text-muted-foreground">
          Integrated with backend_Education API.
        </p>
        <div className="mt-6 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
          <p className="text-amber-800 dark:text-amber-200">
            Institution context required. Please{" "}
            <Link href={ROUTES.login} className="underline">log in</Link> with an institution.
          </p>
        </div>
      </div>
    );
  }

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      await attendanceService.record(
        { studentId, date, status, remarks: remarks || undefined },
        institutionId
      );
      setSuccess(true);
      setStudentId("");
      setRemarks("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Attendance</h1>
      <p className="mt-1 text-muted-foreground">
        Record attendance via backend API (manual entry).
      </p>
      <form onSubmit={handleRecord} className="mt-6 max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Student ID (UUID)</label>
          <Input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            placeholder="550e8400-e29b-41d4-a716-446655440000"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            disabled={loading}
          >
            <option value="PRESENT">PRESENT</option>
            <option value="ABSENT">ABSENT</option>
            <option value="LATE">LATE</option>
            <option value="EXCUSED">EXCUSED</option>
            <option value="LEAVE">LEAVE</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Remarks</label>
          <Input
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional"
            disabled={loading}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-primary">Recorded successfully.</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Recording…" : "Record Attendance"}
        </Button>
      </form>
    </div>
  );
}
