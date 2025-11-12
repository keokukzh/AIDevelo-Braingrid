import type { Metadata } from "next";
import "./globals.css";
import AuthButton from "@/components/AuthButton";

export const metadata: Metadata = {
  title: "Interactive Learning Dashboard",
  description: "A comprehensive learning platform with AI-powered explanations and real-time event demonstrations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text-primary">
        <header className="border-b border-border bg-surface">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Learning Dashboard</h1>
            <AuthButton />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}

