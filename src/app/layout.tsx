// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Toaster } from "@/components/ui/sonner"; // ✅ Εισαγωγή

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AuraGenius",
  description: "Your AI personal style & grooming advisor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <Toaster richColors position="top-right" /> {/* ✅ Προσθήκη του Toaster */}
      </body>
    </html>
  );
}