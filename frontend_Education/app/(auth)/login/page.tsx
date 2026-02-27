"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/constants";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillInstitutionId = searchParams.get("institutionId") ?? "";
  const showRegisteredMessage = searchParams.get("registered") === "1";

  const [institutionId, setInstitutionId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (prefillInstitutionId) setInstitutionId(prefillInstitutionId);
  }, [prefillInstitutionId]);

  const { login, isLoading, error, success, reset } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    try {
      await login({ institutionId, email, password });
      router.push(ROUTES.dashboard);
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="mt-1 text-muted-foreground">
            Enter your institution ID, email, and password
          </p>
        </div>

        {showRegisteredMessage && (
          <div
            className="rounded-md border border-green-500/50 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400"
            role="status"
          >
            Institution created. Sign in to continue.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="institutionId"
              className="text-sm font-medium leading-none"
            >
              Institution ID
            </label>
            <Input
              id="institutionId"
              type="text"
              placeholder="e.g. inst-123-uuid"
              value={institutionId}
              onChange={(e) => setInstitutionId(e.target.value)}
              required
              autoComplete="organization"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="admin@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="current-password"
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

          {success && (
            <div
              className="rounded-md border border-green-500/50 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400"
              role="status"
            >
              Login successful. Redirecting…
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an institution?{" "}
          <Link href={ROUTES.register} className="underline hover:text-foreground">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh items-center justify-center p-4">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
