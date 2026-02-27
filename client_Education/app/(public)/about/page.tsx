"use client";

import { motion } from "framer-motion";

const timeline = [
  { year: "1990", title: "Founded", description: "Institution established with a vision for excellence." },
  { year: "2000", title: "Expansion", description: "New campus and expanded programs." },
  { year: "2015", title: "Accreditation", description: "National accreditation achieved." },
  { year: "2024", title: "Today", description: "Serving 10,000+ students annually." },
];

export default function AboutPage() {
  return (
    <div className="container px-4 py-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Excellence in education since 1990. We are committed to shaping futures
          and building leaders.
        </p>
      </div>

      <div className="mt-16 grid gap-12 md:grid-cols-2">
        <section>
          <h2 className="text-2xl font-semibold">Our Vision</h2>
          <p className="mt-4 text-muted-foreground">
            To be a globally recognized institution of excellence, nurturing
            individuals who lead with integrity and contribute meaningfully to
            society.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="mt-4 text-muted-foreground">
            To provide quality education through innovative teaching, research,
            and community engagement, empowering students to achieve their full
            potential.
          </p>
        </section>
      </div>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold mb-8">Our History</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative flex gap-8 pb-12 last:pb-0 md:gap-16 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div
                className={`flex-1 pl-12 md:pl-0 ${
                  i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"
                }`}
              >
                <span className="text-sm font-medium text-primary">{item.year}</span>
                <h3 className="mt-1 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div className="absolute left-4 w-3 h-3 rounded-full bg-primary md:left-1/2 md:-translate-x-[5px]" />
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold mb-6">Leadership</h2>
        <p className="text-muted-foreground">
          Our experienced leadership team brings decades of expertise in
          education and administration.
        </p>
      </section>
    </div>
  );
}
