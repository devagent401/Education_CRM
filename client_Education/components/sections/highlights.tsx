"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, Users, Globe } from "lucide-react";

const highlights = [
  {
    icon: Award,
    title: "Accredited Excellence",
    description: "Nationally accredited programs meeting highest standards.",
  },
  {
    icon: BookOpen,
    title: "Innovative Curriculum",
    description: "Industry-aligned learning designed for real-world success.",
  },
  {
    icon: Users,
    title: "Expert Faculty",
    description: "Learn from experienced educators and industry professionals.",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description: "International partnerships and exchange opportunities.",
  },
];

export function HighlightsSection() {
  return (
    <section className="py-20">
      <div className="container px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="rounded-full bg-primary/10 p-4">
                <item.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
