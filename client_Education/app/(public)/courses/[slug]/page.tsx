"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { mockCourses } from "@/data/mock";

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const course = mockCourses.find((c) => c.slug === slug);

  if (!course) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <Link href={ROUTES.courses}>
          <Button variant="link" className="mt-4">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container px-4 py-16"
    >
      <Link href={ROUTES.courses} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Courses
      </Link>
      <h1 className="text-4xl font-bold">{course.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{course.description}</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-semibold">Duration</h3>
          <p className="text-muted-foreground">{course.duration}</p>
        </div>
        <div>
          <h3 className="font-semibold">Eligibility</h3>
          <p className="text-muted-foreground">{course.eligibility}</p>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="font-semibold">Learning Outcomes</h3>
        <ul className="mt-4 space-y-2">
          {course.outcomes.map((outcome) => (
            <li key={outcome} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              {outcome}
            </li>
          ))}
        </ul>
      </div>
      <Link href={ROUTES.admission} className="inline-block mt-8">
        <Button size="lg">Apply Now</Button>
      </Link>
    </motion.div>
  );
}
