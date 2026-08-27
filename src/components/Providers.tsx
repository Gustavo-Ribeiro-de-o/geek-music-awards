"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { VoteProvider } from "./VoteProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <VoteProvider>{children}</VoteProvider>
    </SessionProvider>
  );
}
