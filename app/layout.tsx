import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Workflow Studio",
  description: "Design and document workflows that keep your team aligned.",
  icons: {
    icon: "/icon.svg"
  }
};

const fontFamily = "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily }}>{children}</body>
    </html>
  );
}
