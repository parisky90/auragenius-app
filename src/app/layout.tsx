// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Εισαγωγή της γραμματοσειράς
import "./globals.css";
import Header from "@/components/shared/Header"; // Υποθέτοντας ότι το έχεις φτιάξει
import Footer from "@/components/shared/Footer"; // Υποθέτοντας ότι το έχεις φτιάξει

// Ρύθμιση της γραμματοσειράς
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AuraGenius - Your AI Stylist",
  description: "Get personalized style and grooming advice with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}> {/* Προσθήκη της μεταβλητής γραμματοσειράς */}
      <body className="flex flex-col h-full"> {/* Βοηθάει για sticky footer */}
        <Header />
        <main className="flex-grow">{children}</main> {/* Το κυρίως περιεχόμενο να μεγαλώνει */}
        <Footer />
      </body>
    </html>
  );
}