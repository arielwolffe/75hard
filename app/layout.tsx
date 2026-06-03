import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "75 Hard",
  description: "Your personal 75 Hard challenge tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} h-full`}>
      <body className="min-h-full bg-soft font-sans text-foreground antialiased">
        <div className="flex min-h-screen flex-col">
          <main className="flex-1 pb-20">{children}</main>
          <Navigation />
        </div>
      </body>
    </html>
  );
}
