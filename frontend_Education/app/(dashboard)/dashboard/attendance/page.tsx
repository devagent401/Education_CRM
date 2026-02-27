"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useRecordAttendance,
  useAttendanceUpload,
} from "@/lib/hooks";
import { useAuthStore } from "@/lib/stores/use-auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/constants";
import type { AttendanceStatus } from "@/lib/api/types";

const ATTENDANCE_STATUSES: AttendanceStatus[] = [
  "PRESENT",
  "ABSENT",
  "LATE",
  "EXCUSED",
  "LEAVE",
];

export default function AttendancePage() {
  const institutionId = useAuthStore((s) => s.institutionId);
  const [activeTab, setActiveTab] = useState<"manual" | "upload">("manual");

  if (!institutionId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Manual entry, CSV/Excel upload, or image OCR.
          </p>
        </div>
        <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
          <p className="text-amber-800 dark:text-amber-200">
            Institution context required. Please{" "}
            <Link href={ROUTES.login} className="underline hover:no-underline">
              sign in
            </Link>{" "}
            or{" "}
            <Link href={ROUTES.register} className="underline hover:no-underline">
              create an institution
            </Link>{" "}
            first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">
          Manual entry, CSV/Excel upload, or image OCR.
        </p>
      </div>

      <div className="flex gap-2 border-b pb-2">
        <Button
          variant={activeTab === "manual" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("manual")}
        >
          Manual entry
        </Button>
        <Button
          variant={activeTab === "upload" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("upload")}
        >
          Bulk upload
        </Button>
      </div>

      {activeTab === "manual" && <ManualAttendanceForm />}
      {activeTab === "upload" && <BulkAttendanceUpload />}
    </div>
  );
}

function ManualAttendanceForm() {
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [status, setStatus] = useState<AttendanceStatus>("PRESENT");
  const [remarks, setRemarks] = useState("");

  const {
    recordAttendance,
    isLoading,
    error,
    data,
    reset,
  } = useRecordAttendance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    try {
      await recordAttendance({ studentId, date, status, remarks: remarks || undefined });
      setStudentId("");
      setRemarks("");
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <h2 className="mb-4 text-lg font-medium">Record single attendance</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label htmlFor="studentId" className="text-sm font-medium">
            Student ID (UUID)
          </label>
          <Input
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium">
            Date
          </label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={isLoading}
          >
            {ATTENDANCE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="remarks" className="text-sm font-medium">
            Remarks
          </label>
          <Input
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional"
            disabled={isLoading}
          />
        </div>
        {error && (
          <div
            className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {error}
          </div>
        )}
        {data && (
          <div
            className="rounded-md border border-green-500/50 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400"
            role="status"
          >
            Attendance recorded successfully.
          </div>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Recording…" : "Record attendance"}
        </Button>
      </form>
    </div>
  );
}

function BulkAttendanceUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [uploadType, setUploadType] = useState<"csv" | "excel" | "image">("csv");

  const {
    upload,
    submitCsv,
    isLoading,
    error,
    preview,
    submitResult,
    reset,
  } = useAttendanceUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f ?? null);
    reset();
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    reset();
    try {
      await upload(file, date, uploadType);
    } catch {
      // Error handled by hook
    }
  };

  const acceptMap = {
    csv: ".csv",
    excel: ".xlsx,.xls",
    image: "image/*",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4">
        <h2 className="mb-4 text-lg font-medium">Bulk upload</h2>
        <form onSubmit={handlePreview} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">
              File type
            </label>
            <select
              id="type"
              value={uploadType}
              onChange={(e) => {
                setUploadType(e.target.value as "csv" | "excel" | "image");
                setFile(null);
                reset();
              }}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              disabled={isLoading}
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="image">Image (OCR)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="bulkDate" className="text-sm font-medium">
              Date
            </label>
            <Input
              id="bulkDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="file" className="text-sm font-medium">
              File
            </label>
            <Input
              id="file"
              type="file"
              accept={acceptMap[uploadType]}
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              CSV: columns roll_number or student_id, status, remarks. Excel/Image: similar structure.
            </p>
          </div>
          {error && (
            <div
              className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <Button type="submit" disabled={!file || isLoading}>
              {isLoading ? "Processing…" : "Preview"}
            </Button>
            {uploadType === "csv" && preview?.preview && (
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  if (file) submitCsv(file, date).catch(() => {});
                }}
                disabled={isLoading || (preview.preview?.invalid?.length ?? 0) > 0}
              >
                {isLoading ? "Submitting…" : "Submit"}
              </Button>
            )}
          </div>
        </form>
      </div>

      {preview && (
        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-3 font-medium">Preview</h3>
          {preview.parseErrors && preview.parseErrors.length > 0 && (
            <div className="mb-3 rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">
              <p className="font-medium">Parse errors:</p>
              <ul className="mt-1 list-inside list-disc">
                {preview.parseErrors.map((e, i) => (
                  <li key={i}>
                    Row {e.row}: {e.message ?? (e as { error?: string }).error ?? "Unknown error"}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {preview.preview && (
            <div className="space-y-2 text-sm">
              <p>
                Valid: {preview.preview.valid.length} | Invalid:{" "}
                {preview.preview.invalid.length} | Total:{" "}
                {preview.preview.totalProcessed}
              </p>
              {preview.preview.invalid.length > 0 && (
                <div className="max-h-40 overflow-auto rounded border p-2">
                  <p className="font-medium text-destructive">Invalid rows:</p>
                  <ul className="mt-1 space-y-1">
                    {preview.preview.invalid.map((row, i) => (
                      <li key={i}>
                        Row {row.row}: {row.errors?.join("; ")}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {submitResult && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
          <h3 className="font-medium text-green-800 dark:text-green-200">
            Submit complete
          </h3>
          <p className="mt-1 text-sm">
            Created: {submitResult.created} | Skipped: {submitResult.skipped}
          </p>
          {submitResult.errors.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-sm">
              {submitResult.errors.map((e, i) => (
                <li key={i}>
                  Row {e.row}: {e.error}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
