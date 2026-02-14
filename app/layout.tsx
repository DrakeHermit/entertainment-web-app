import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Entertainment Web App",
  description: "A web app for entertainment",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
