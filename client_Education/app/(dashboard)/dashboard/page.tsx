"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Calendar, FileText } from "lucide-react";

const stats = [
  { label: "Courses", value: "12", icon: BookOpen, href: "/dashboard/courses" },
  { label: "Faculty", value: "45", icon: Users, href: "/dashboard/faculty" },
  { label: "Events", value: "8", icon: Calendar, href: "/dashboard/events" },
  { label: "Notices", value: "24", icon: FileText, href: "/dashboard/notices" },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">
        Welcome back. Here&apos;s an overview of your institution.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold">Quick Insights</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage your courses, faculty, events, and notices from the sidebar.
              API integration ready for backend connection.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
