"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export function CTASection() {
  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="container px-4"
      >
        <div className="rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to Begin Your Journey?
          </h2>
          <p className="mt-4 text-primary-foreground/90 max-w-xl mx-auto">
            Join our community of learners and take the first step towards a
            brighter future.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ROUTES.admission}>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Apply for Admission
              </Button>
            </Link>
            <Link href={ROUTES.contact}>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
