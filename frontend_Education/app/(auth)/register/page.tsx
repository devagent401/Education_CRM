"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateInstitution } from "@/lib/hooks";
import { useAuthStore } from "@/lib/stores/use-auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/constants";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const { createInstitution, isLoading, error, data, reset } =
    useCreateInstitution();
  const setInstitutionId = useAuthStore((s) => s.setInstitutionId);
  const router = useRouter();

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug || slug === slugify(name)) {
      setSlug(slugify(value));
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value.toUpperCase().replace(/[^A-Z0-9-]/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    try {
      const institution = await createInstitution({
        name,
        code,
        slug: slug || slugify(name),
        email,
        phone: phone || undefined,
        address: address || undefined,
      });
      setInstitutionId(institution.id);
      router.push(
        `${ROUTES.login}?registered=1&institutionId=${encodeURIComponent(institution.id)}`
      );
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create institution</h1>
          <p className="mt-1 text-muted-foreground">
            Register a new educational institution
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none">
              Institution name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. Central School"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium leading-none">
              Code
            </label>
            <Input
              id="code"
              type="text"
              placeholder="e.g. CS-001"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium leading-none">
              Slug
            </label>
            <Input
              id="slug"
              type="text"
              placeholder="central-school"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
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
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium leading-none">
              Phone
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium leading-none">
              Address
            </label>
            <Input
              id="address"
              type="text"
              placeholder="123 Main St"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
              Institution created. Redirecting to login…
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating…" : "Create institution"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={ROUTES.login} className="underline hover:text-foreground">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
