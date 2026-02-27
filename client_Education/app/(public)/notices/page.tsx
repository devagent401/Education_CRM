"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import { mockNotices } from "@/data/mock";

export default function NoticesPage() {
  return (
    <div className="container px-4 py-16">
      <h1 className="text-4xl font-bold">Notices & News</h1>
      <p className="mt-4 text-muted-foreground max-w-2xl">
        Latest announcements and updates.
      </p>
      <div className="mt-12 space-y-6">
        {mockNotices.map((notice, i) => (
          <motion.article
            key={notice.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={ROUTES.notice(notice.slug)}>
              <div className="rounded-xl border p-6 transition-colors hover:bg-muted/50">
                <h3 className="font-semibold text-lg">{notice.title}</h3>
                <time className="text-sm text-muted-foreground">{notice.publishedAt}</time>
                <p className="mt-2 text-muted-foreground line-clamp-2">{notice.content}</p>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
