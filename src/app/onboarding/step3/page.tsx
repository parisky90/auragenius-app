// src/app/onboarding/step3/page.tsx
"use client"; // Προσθέτουμε "use client" αν σκοπεύουμε να έχουμε client-side interactivity (π.χ. κουμπιά με Link)

import { Button } from "@/components/ui/button"; // Εισάγουμε το Button αν θέλουμε κουμπιά
import Link from "next/link"; // Για πλοήγηση
import { CheckCircle } from "lucide-react"; // Ένα ωραίο εικονίδιο

// Αυτό είναι ένα React Server Component by default αν δεν βάλεις "use client".
// Αν είναι απλή σελίδα χωρίς client-side hooks (useState, useEffect, onClick handlers που χρειάζονται JS στον client),
// δεν χρειάζεται το "use client". Αλλά για links με Next.js Link και buttons, είναι καλή πρακτική.
// Αν όμως το κάνεις client component, θυμήσου ότι δεν μπορείς να κάνεις async/await για data fetching απευθείας εδώ.

export default function OnboardingStep3Page() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10"> {/* Αφαίρεσα το min-h για να μην πιέζει το layout */}
      <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        Το Onboarding Ολοκληρώθηκε!
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Οι προτιμήσεις στυλ σου έχουν αποθηκευτεί. Είσαι έτοιμος/η να ανακαλύψεις εξατομικευμένες προτάσεις!
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/profile">Δες το Προφίλ σου</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
          <Link href="/analyze">Ξεκίνα μια Νέα Ανάλυση</Link>
        </Button>
      </div>
    </div>
  );
}