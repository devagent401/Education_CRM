"use client";

import Link from "next/link";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar, DashboardNavbar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/use-auth-store";
import { ROUTES } from "@/lib/constants";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, institutionId, logout, isAuthenticated } = useAuthStore();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardNavbar>
          {isAuthenticated() ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user?.name} ({institutionId ? "Institution" : "—"})
              </span>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                Sign out
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.login}>Sign in</Link>
            </Button>
          )}
        </DashboardNavbar>
        <div className="flex flex-1 flex-col p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
