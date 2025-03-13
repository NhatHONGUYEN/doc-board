// components/Providers.tsx
"use client"; // Mark this as a Client Component

import TanstackProvider from "@/lib/TanstackProvider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TanstackProvider>{children}</TanstackProvider>
    </SessionProvider>
  );
}
