"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  FileText,
  Layout,
  Settings,
  ClipboardCheck,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

const navItems = [
  { href: ROUTES.dashboard, label: "Overview", icon: LayoutDashboard },
  { href: ROUTES.dashboardCourses, label: "Courses", icon: BookOpen },
  { href: ROUTES.dashboardFaculty, label: "Faculty", icon: Users },
  { href: ROUTES.dashboardEvents, label: "Events", icon: Calendar },
  { href: ROUTES.dashboardNotices, label: "Notices", icon: FileText },
  { href: ROUTES.dashboardAttendance, label: "Attendance", icon: ClipboardCheck },
  { href: ROUTES.dashboardHomepage, label: "Homepage", icon: Layout },
  { href: ROUTES.dashboardSettings, label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <Link href={ROUTES.home} className="font-semibold">
            Edu Institution
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Dashboard</p>
        </div>
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-4 border-t">
          <Link
            href={ROUTES.home}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
