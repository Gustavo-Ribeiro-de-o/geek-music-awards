import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { GmaHeader } from "@/components/GmaHeader";
import { GmaFooter } from "@/components/GmaFooter";

export const metadata: Metadata = {
  title: "Geek Music Awards",
  description: "Vote nos maiores nomes da música geek — com login por e-mail.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <GmaHeader />
          <main>{children}</main>
          <GmaFooter />
        </Providers>
      </body>
    </html>
  );
}
