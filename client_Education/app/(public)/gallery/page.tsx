"use client";

import { motion } from "framer-motion";
import { mockEvents } from "@/data/mock";

export default function GalleryPage() {
  return (
    <div className="container px-4 py-16">
      <h1 className="text-4xl font-bold">Gallery & Events</h1>
      <p className="mt-4 text-muted-foreground max-w-2xl">
        Highlights from our campus life and events.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {mockEvents.map((event, i) => (
          <motion.article
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border overflow-hidden"
          >
            <div className="h-48 bg-muted" />
            <div className="p-6">
              <time className="text-sm text-muted-foreground">{event.date}</time>
              <h3 className="mt-2 font-semibold text-lg">{event.title}</h3>
              <p className="mt-2 text-muted-foreground">{event.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
