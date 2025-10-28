import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DynamicProvider from "@/lib/providers/DynamicProvider";
import ConditionalHeader from "@/components/layout/ConditionalHeader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlockCity - Bitcoin Rewards Platform",
  description: "Reward your customers with Bitcoin staking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-gray-50`}>
        <DynamicProvider>
          <ConditionalHeader />
          <main className="min-h-screen">
            {children}
          </main>
        </DynamicProvider>
      </body>
    </html>
  );
}
