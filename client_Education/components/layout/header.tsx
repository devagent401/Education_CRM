"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

const navLinks = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.about, label: "About" },
  { href: ROUTES.courses, label: "Courses" },
  { href: ROUTES.faculty, label: "Faculty" },
  { href: ROUTES.gallery, label: "Gallery" },
  { href: ROUTES.notices, label: "Notices" },
  { href: ROUTES.contact, label: "Contact" },
  { href: ROUTES.admission, label: "Admission" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href={ROUTES.home} className="text-xl font-bold tracking-tight">
          Edu Institution
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link href={ROUTES.register}>
            <Button variant="ghost" size="sm" type="button">Register</Button>
          </Link>
          <Link href={ROUTES.login}>
            <Button variant="ghost" size="sm" type="button">Admin Login</Button>
          </Link>
          <Link href={ROUTES.admission}>
            <Button size="sm" type="button">Apply Now</Button>
          </Link>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t"
          >
            <nav className="container flex flex-col gap-2 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2 text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-4">
                <Link href={ROUTES.login} className="flex-1">
                  <Button variant="outline" className="w-full" type="button">Login</Button>
                </Link>
                <Link href={ROUTES.admission} className="flex-1">
                  <Button className="w-full" type="button">Apply</Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
