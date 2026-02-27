import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-semibold">Edu Institution</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Excellence in education since 1990. Shaping futures, building leaders.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li><Link href={ROUTES.about} className="hover:text-foreground">About</Link></li>
              <li><Link href={ROUTES.courses} className="hover:text-foreground">Courses</Link></li>
              <li><Link href={ROUTES.admission} className="hover:text-foreground">Admission</Link></li>
              <li><Link href={ROUTES.contact} className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Contact</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              123 Education Lane<br />
              City, State 12345<br />
              admissions@edu.edu
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Follow Us</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Social links placeholder
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Edu Institution. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
