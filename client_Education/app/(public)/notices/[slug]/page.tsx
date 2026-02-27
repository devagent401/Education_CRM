"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { mockNotices } from "@/data/mock";

export default function NoticeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const notice = mockNotices.find((n) => n.slug === slug);

  if (!notice) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Notice not found</h1>
        <Link href={ROUTES.notices}>
          <Button variant="link" className="mt-4">Back to Notices</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container px-4 py-16 max-w-3xl"
    >
      <Link href={ROUTES.notices} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Notices
      </Link>
      <time className="text-sm text-muted-foreground">{notice.publishedAt}</time>
      <h1 className="mt-2 text-4xl font-bold">{notice.title}</h1>
      <div className="mt-8 prose prose-slate dark:prose-invert max-w-none">
        <p>{notice.content}</p>
      </div>
    </motion.div>
  );
}
