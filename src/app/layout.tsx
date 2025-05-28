// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Βεβαιώσου ότι αυτό το αρχείο υπάρχει και είναι σωστά ρυθμισμένο
import Header from "@/components/shared/Header"; // Βεβαιώσου ότι το path είναι σωστό
import Footer from "@/components/shared/Footer"; // Βεβαιώσου ότι το path είναι σωστό

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter", // Αυτό χρησιμοποιείται στο tailwind.config.ts
  display: 'swap', // Καλό για performance
});

export const metadata: Metadata = {
  title: "AuraGenius - Your AI Stylist",
  description: "Get personalized style and grooming advice with AI.",
  // Μπορείς να προσθέσεις κι άλλα metadata εδώ, π.χ. viewport για responsiveness
  // viewport: 'width=device-width, initial-scale=1', 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex flex-col h-full bg-background text-foreground">
        {/* 
          ΣΗΜΑΝΤΙΚΗ ΠΑΡΑΤΗΡΗΣΗ ΓΙΑ HYDRATION:
          Βεβαιώσου ότι δεν υπάρχουν κενά ή σχόλια HTML που εισάγονται από επεκτάσεις του browser
          ή άλλα εργαλεία μεταξύ των tags που βλέπεις εδώ.
          Η δομή πρέπει να είναι καθαρή.
        */}
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6 sm:py-8"> {/* Μικρή προσαρμογή στο padding */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}