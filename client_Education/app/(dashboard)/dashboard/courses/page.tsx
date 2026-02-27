"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { mockCourses } from "@/data/mock";

export default function ManageCoursesPage() {
  const [courses] = useState(mockCourses);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Courses</h1>
        <Button>Add Course</Button>
      </div>
      <p className="mt-1 text-muted-foreground">
        Create and manage your institution&apos;s programs.
      </p>
      <div className="mt-6">
        <Input placeholder="Search courses..." className="max-w-sm mb-4" />
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium">Title</th>
                <th className="text-left p-4 font-medium">Duration</th>
                <th className="text-left p-4 font-medium">Eligibility</th>
                <th className="p-4 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b last:border-0">
                  <td className="p-4 font-medium">{course.title}</td>
                  <td className="p-4 text-muted-foreground">{course.duration}</td>
                  <td className="p-4 text-muted-foreground">{course.eligibility}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
