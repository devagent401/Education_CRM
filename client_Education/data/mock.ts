// Mock data for development - replace with API calls when backend is ready
import type { Course, Faculty, Event, Notice, Testimonial } from "@/lib/types";

export const mockCourses: Course[] = [
  {
    id: "1",
    slug: "computer-science",
    title: "Computer Science",
    description: "Comprehensive program covering programming, algorithms, and software engineering.",
    duration: "4 years",
    eligibility: "12th grade with Mathematics",
    outcomes: ["Software Developer", "Data Scientist", "Systems Architect"],
  },
  {
    id: "2",
    slug: "business-administration",
    title: "Business Administration",
    description: "Learn management, finance, and leadership skills for modern business.",
    duration: "3 years",
    eligibility: "12th grade",
    outcomes: ["Manager", "Entrepreneur", "Consultant"],
  },
];

export const mockFaculty: Faculty[] = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    role: "Head of Department",
    qualification: "Ph.D. Computer Science, MIT",
  },
  {
    id: "2",
    name: "Prof. James Chen",
    role: "Senior Lecturer",
    qualification: "M.Sc. Business, Stanford",
  },
];

export const mockEvents: Event[] = [
  { id: "1", title: "Annual Science Fair", description: "Student projects showcase", date: "2025-03-15" },
  { id: "2", title: "Career Day", description: "Industry professionals speak", date: "2025-04-20" },
];

export const mockNotices: Notice[] = [
  {
    id: "1",
    slug: "admission-2025",
    title: "Admission 2025 Open",
    content: "Applications are now open for the academic year 2025-26.",
    publishedAt: "2025-02-01",
  },
];

export const mockTestimonials: Testimonial[] = [
  { id: "1", name: "Alex Kumar", role: "Alumni 2023", content: "Outstanding faculty and facilities. Best decision of my life." },
  { id: "2", name: "Priya Sharma", role: "Parent", content: "My child has grown tremendously. Highly recommend." },
];
