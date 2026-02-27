"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/constants";

const steps = [
  "Submit online application",
  "Upload required documents",
  "Entrance exam / Interview",
  "Fee payment & enrollment",
];

export default function AdmissionPage() {
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
  };

  return (
    <div className="container px-4 py-16">
      <h1 className="text-4xl font-bold">Admission</h1>
      <p className="mt-4 text-muted-foreground max-w-2xl">
        Start your journey with us. Follow the process below.
      </p>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">Admission Process</h2>
        <div className="mt-8 space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {i + 1}
              </div>
              <div>
                <p className="font-medium">{step}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border p-6"
        >
          <h3 className="flex items-center gap-2 font-semibold text-lg">
            <FileText className="h-5 w-5" /> Apply Now
          </h3>
          <p className="mt-2 text-muted-foreground">
            Fill out the application form and submit required documents.
          </p>
          <Link href={ROUTES.contact}>
            <Button size="lg" className="mt-6">
              Start Application
            </Button>
          </Link>
        </motion.div>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleInquirySubmit}
          className="rounded-xl border p-6"
        >
          <h3 className="font-semibold text-lg">Inquiry Form</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Have questions? Send us an inquiry.
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="inq-name" className="block text-sm font-medium mb-1">Name</label>
              <Input id="inq-name" required placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="inq-email" className="block text-sm font-medium mb-1">Email</label>
              <Input id="inq-email" type="email" required placeholder="your@email.com" />
            </div>
            <div>
              <label htmlFor="inq-program" className="block text-sm font-medium mb-1">Program of Interest</label>
              <Input id="inq-program" placeholder="e.g. Computer Science" />
            </div>
            {inquirySubmitted && (
              <p className="flex items-center gap-2 text-sm text-primary">
                <Check className="h-4 w-4" /> Thank you! We&apos;ll contact you soon.
              </p>
            )}
            <Button type="submit" className="w-full">Submit Inquiry</Button>
          </div>
        </motion.form>
      </section>
    </div>
  );
}
