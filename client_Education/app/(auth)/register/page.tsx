"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { institutionService } from "@/services/institution.service";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ApiError } from "@/lib/api/client";
import { ROUTES } from "@/lib/constants";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const setInstitutionId = useAuthStore((s) => s.setInstitutionId);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const inst = await institutionService.create({
        name,
        code,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        email,
        phone: phone || undefined,
        address: address || undefined,
      });
      setInstitutionId(inst.id);
      router.push(`${ROUTES.login}?institutionId=${encodeURIComponent(inst.id)}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create institution");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 rounded-xl border bg-card p-6 shadow-sm"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create Institution</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Register your institution via API
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Institution Name" disabled={isLoading} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Code</label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} required placeholder="e.g. EDU01" disabled={isLoading} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="edu-institution" disabled={isLoading} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@edu.edu" disabled={isLoading} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" disabled={isLoading} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Optional" disabled={isLoading} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating…" : "Create Institution"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Already have one?{" "}
          <Link href={ROUTES.login} className="underline hover:text-foreground">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
