// src/app/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4 py-10 sm:py-16">
      {/* ... (το υπόλοιπο περιεχόμενο παραμένει το ίδιο) ... */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
        Ανακάλυψε το <span className="text-primary">Τέλειο Στυλ</span> σου με AI
      </h1>
      <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10">
        Το AuraGenius είναι ο προσωπικός σου AI σύμβουλος που αναλύει την εμφάνισή σου
        και σου προτείνει εξατομικευμένες λύσεις για ρούχα, περιποίηση και μακιγιάζ,
        για κάθε περίσταση!
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/onboarding">Ξεκίνα Τώρα Δωρεάν</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
          <Link href="/how-it-works">Πώς Λειτουργεί;</Link>
        </Button>
      </div>
      <div className="mt-16 text-sm text-muted-foreground">
        {/* Το απλό Link παραμένει ως έχει */}
        <p>Ήδη μέλος; <Link href="/login" className="font-semibold text-primary hover:underline">Συνδέσου εδώ</Link></p>
      </div>
    </div>
  );
}