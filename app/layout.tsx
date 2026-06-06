import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Workout AI",
  description: "Log your workouts and get AI-powered comments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
