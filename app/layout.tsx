import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Entertainment Web App",
  description:
    "A web app that let's you search and bookmark your favorite movies and TV series",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#161D2F",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
