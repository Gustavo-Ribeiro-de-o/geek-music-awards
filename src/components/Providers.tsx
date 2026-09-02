"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { VoteProvider } from "./VoteProvider";
import { WelcomeModal } from "./WelcomeModal";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <VoteProvider>
        {children}
        <WelcomeModal />
      </VoteProvider>
    </SessionProvider>
  );
}
