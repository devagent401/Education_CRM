"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { mockCourses } from "@/data/mock";

export default function CoursesPage() {
  return (
    <div className="container px-4 py-16">
      <h1 className="text-4xl font-bold">Programs & Courses</h1>
      <p className="mt-4 text-muted-foreground max-w-2xl">
        Explore our range of programs designed to equip you for success.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockCourses.map((course, i) => (
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
                  <p className="mt-4 text-sm">
                    <span className="font-medium">Duration:</span> {course.duration}
                  </p>
                  <p className="mt-1 text-sm">
                    <span className="font-medium">Eligibility:</span> {course.eligibility}
                  </p>
                  <ArrowRight className="mt-4 h-4 w-4 text-primary" />
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
