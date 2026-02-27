"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container px-4 py-16">
      <h1 className="text-4xl font-bold">Contact Us</h1>
      <p className="mt-4 text-muted-foreground max-w-2xl">
        Get in touch. We&apos;d love to hear from you.
      </p>
      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex gap-4">
            <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Address</h3>
              <p className="text-muted-foreground">
                123 Education Lane<br />
                City, State 12345
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Phone className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-muted-foreground">+1 (234) 567-8900</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Mail className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-muted-foreground">admissions@edu.edu</p>
            </div>
          </div>
          <div className="h-64 rounded-xl bg-muted mt-8" title="Map placeholder" />
        </motion.div>
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border p-6"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
            <Input id="name" required placeholder="Your name" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
            <Input id="email" type="email" required placeholder="your@email.com" />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
            <Input id="subject" placeholder="How can we help?" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
            <textarea
              id="message"
              required
              rows={5}
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Your message..."
            />
          </div>
          {submitted && (
            <p className="text-sm text-primary">Thank you! We&apos;ll get back to you soon.</p>
          )}
          <Button type="submit" className="w-full">Send Message</Button>
        </motion.form>
      </div>
    </div>
  );
}
