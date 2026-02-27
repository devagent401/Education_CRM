"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { mockFaculty } from "@/data/mock";

export default function FacultyPage() {
  return (
    <div className="container px-4 py-16">
      <h1 className="text-4xl font-bold">Our Faculty</h1>
      <p className="mt-4 text-muted-foreground max-w-2xl">
        Meet our dedicated educators and industry experts.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockFaculty.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className="h-48 bg-muted" />
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-primary">{member.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">{member.qualification}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
