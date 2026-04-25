import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recourse — You have recourse.",
  description:
    "Recourse turns confusing medical bills into statute-backed dispute letters in 90 seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-ink">
        {children}
      </body>
    </html>
  );
}
