"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { mockCourses } from "@/data/mock";

export function CoursesPreviewSection() {
  return (
    <section className="py-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold md:text-4xl">Our Programs</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Choose from a wide range of programs designed to equip you for the
            future.
          </p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockCourses.slice(0, 3).map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={ROUTES.course(course.slug)}>
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/20">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                    <p className="mt-4 text-sm font-medium text-primary">
                      {course.duration}
                    </p>
                    <ArrowRight className="mt-2 h-4 w-4 text-primary" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link href={ROUTES.courses}>
            <Button variant="outline" size="lg">
              View All Programs
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
