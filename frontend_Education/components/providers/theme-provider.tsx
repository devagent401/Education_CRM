"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

/**
 * Wraps the app with next-themes for dark/light/system mode.
 * - attribute="class" for Tailwind dark: variant
 * - enableSystem detects OS preference
 * - disableTransitionOnChange=false for smooth theme switches
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="edu-institution-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
