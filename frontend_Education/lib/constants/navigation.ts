import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardCheck,
  FileQuestion,
  Wallet,
  Settings,
} from "lucide-react";
import { ROUTES } from ".";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Roles that can see this item. Empty = all roles */
  roles?: string[];
};

export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { title: "Students", href: ROUTES.students, icon: Users },
  { title: "Teachers", href: ROUTES.teachers, icon: GraduationCap },
  { title: "Attendance", href: ROUTES.attendance, icon: ClipboardCheck },
  { title: "Exams", href: ROUTES.exams, icon: FileQuestion },
  { title: "Fees", href: ROUTES.fees, icon: Wallet },
  { title: "Settings", href: ROUTES.settings, icon: Settings },
];
