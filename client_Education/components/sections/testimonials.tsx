"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { mockTestimonials } from "@/data/mock";

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold md:text-4xl">What People Say</h2>
          <p className="mt-4 text-muted-foreground">
            Hear from our students and their families.
          </p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2">
          {mockTestimonials.map((t, i) => (
            <motion.blockquote
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border bg-card p-6"
            >
              <Quote className="h-10 w-10 text-primary/30" />
              <p className="mt-4 text-lg">&ldquo;{t.content}&rdquo;</p>
              <footer className="mt-4">
                <cite className="font-medium not-italic">{t.name}</cite>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
