"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface DashboardNavbarProps {
  title?: string;
  children?: React.ReactNode;
}

export function DashboardNavbar({ title, children }: DashboardNavbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-2 h-6" />
      {title && (
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      )}
      {children && (
        <div className="ml-auto flex items-center gap-2">{children}</div>
      )}
    </header>
  );
}
