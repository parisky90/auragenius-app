// src/app/profile/page.tsx
"use client";

import { useOnboardingStore } from "@/store/onboardingStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Βεβαιώσου ότι έχεις κάνει: npx shadcn@latest add badge
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Για την ανακατεύθυνση μετά το reset

export default function ProfilePage() {
  const router = useRouter(); // Προσθήκη του router

  // Παίρνουμε κάθε τιμή που χρειαζόμαστε ξεχωριστά.
  // Αυτό μπορεί να βοηθήσει στην αποφυγή περιττών re-renders αν μόνο ένα μέρος του userData αλλάζει.
  const gender = useOnboardingStore((state) => state.userData?.gender);
  const ageGroup = useOnboardingStore((state) => state.userData?.ageGroup);
  const stylePreferences = useOnboardingStore((state) => state.userData?.stylePreferences);
  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);

  const handleReset = () => {
    resetOnboarding();
    // Εμφάνιση μηνύματος και μετά ανακατεύθυνση για να δει ο χρήστης την αλλαγή
    alert("Τα δεδομένα Onboarding έχουν γίνει reset! Θα μεταφερθείτε στην αρχή του onboarding.");
    router.push('/onboarding'); // Ανακατεύθυνση στην αρχή του onboarding
  };

  // Έλεγχος αν υπάρχουν *κάποια* δεδομένα onboarding για να αποφασίσουμε τι θα δείξουμε
  const hasOnboardingData = gender || ageGroup || (stylePreferences && stylePreferences.length > 0);

  return (
    <div className="py-10"> {/* Το container είναι ήδη στο layout.tsx */}
      <h1 className="text-3xl font-bold mb-8 text-center">Το Προφίλ μου</h1>
      
      {hasOnboardingData ? (
        <Card className="w-full max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Οι Πληροφορίες μου</CardTitle>
            <CardDescription>Αυτές είναι οι πληροφορίες που μας έδωσες κατά το onboarding.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {gender && (
              <div>
                <h3 className="font-semibold">Φύλο:</h3>
                <p className="capitalize">{gender}</p>
              </div>
            )}
            {ageGroup && (
              <div>
                <h3 className="font-semibold">Ηλικιακή Ομάδα:</h3>
                <p>{ageGroup}</p>
              </div>
            )}
            {stylePreferences && stylePreferences.length > 0 && (
              <div>
                <h3 className="font-semibold">Προτιμήσεις Στυλ:</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {stylePreferences.map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="text-center text-muted-foreground">
          <p className="mb-4">Δεν έχουν ολοκληρωθεί ακόμα τα βήματα του onboarding.</p>
          <Button asChild>
            <Link href="/onboarding">Ξεκίνα το Onboarding</Link>
          </Button>
        </div>
      )}

      <div className="mt-8 text-center">
        <Button variant="destructive" onClick={handleReset}>
          Reset Onboarding Data (για Test)
        </Button>
      </div>
    </div>
  );
}