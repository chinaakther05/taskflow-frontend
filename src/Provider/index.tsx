
"use client";
import { ReactNode } from "react";
import QueryProvider from "./query-provider";
import GoogleAuthProvider from "./google-auth.provider";
import ThemeProvider from "@/providers/themeProvider";




export default function Providers({children}: {children: ReactNode}) {
  return (
    <ThemeProvider>
    <GoogleAuthProvider>
    <QueryProvider>
      {children}
    </QueryProvider>
    </GoogleAuthProvider>
    </ThemeProvider>
  );
}