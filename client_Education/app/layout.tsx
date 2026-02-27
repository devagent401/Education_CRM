import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Edu Institution | Quality Education for a Bright Future",
  description:
    "Excellence in education. Explore our programs, meet our faculty, and start your journey with us.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
