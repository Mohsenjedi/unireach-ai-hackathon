import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniReach AI | XAMK University",
  description: "Advanced AI-driven international student recruitment platform for XAMK University.",
};

import { AgentCommunicationProvider } from "@/context/AgentCommunicationContext";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AgentCommunicationProvider>
          {children}
        </AgentCommunicationProvider>
      </body>
    </html>
  );
}
