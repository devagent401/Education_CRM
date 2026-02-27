import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Educational Institution Management dashboard.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Students" value="0" href={ROUTES.students} />
        <StatCard title="Teachers" value="0" href={ROUTES.teachers} />
        <StatCard title="Attendance" value="—" href={ROUTES.attendance} />
        <StatCard title="Exams" value="0" href={ROUTES.exams} />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  href,
}: {
  title: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent/50"
    >
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </Link>
  );
}
