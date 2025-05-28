// src/app/onboarding/page.tsx (Παλιότερα το λέγαμε OnboardingStep1Page)
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store/onboardingStore';

export default function OnboardingPage() {
  const router = useRouter();
  const { setUserData, setCurrentStep, userData } = useOnboardingStore();

  // Αρχικοποίηση των τοπικών states από το store, αν υπάρχουν
  const [gender, setGender] = useState<string | undefined>(userData?.gender);
  const [ageGroup, setAgeGroup] = useState<string | undefined>(userData?.ageGroup);

  // Προαιρετικός έλεγχος: Αν ο χρήστης έχει ήδη ολοκληρώσει το onboarding (π.χ. έχει stylePreferences),
  // μπορείς να τον ανακατευθύνεις στο προφίλ ή στην ανάλυση.
  // useEffect(() => {
  //   if (userData?.stylePreferences && userData.stylePreferences.length > 0) {
  //     router.replace('/profile'); // ή '/analyze'
  //   }
  // }, [userData, router]);

  const handleSubmitStep1 = () => {
    if (gender && ageGroup) {
      console.log("Onboarding Step 1 Data to Store:", { gender, ageGroup });
      setUserData({ gender, ageGroup });
      setCurrentStep(2);
      router.push('/onboarding/step2');
    } else {
      alert("Παρακαλώ επιλέξτε φύλο και ηλικιακή ομάδα."); // Καλύτερα να χρησιμοποιήσεις ένα toast/alert component
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10"> {/* Αφαίρεσα το min-h */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Λίγα Λόγια για Εσάς</CardTitle>
          <CardDescription>
            Αυτό θα μας βοηθήσει να εξατομικεύσουμε τις προτάσεις μας. (Βήμα 1 από 3)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="gender" className="font-semibold">Φύλο</Label>
            <RadioGroup
              id="gender"
              onValueChange={setGender}
              value={gender}
              className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="cursor-pointer font-normal">Γυναίκα</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="cursor-pointer font-normal">Άνδρας</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="cursor-pointer font-normal">Άλλο</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age-group" className="font-semibold">Ηλικιακή Ομάδα</Label>
            <Select onValueChange={setAgeGroup} value={ageGroup}>
              <SelectTrigger id="age-group" className="w-full">
                <SelectValue placeholder="Επιλέξτε ηλικιακή ομάδα" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18-24">18-24</SelectItem>
                <SelectItem value="25-34">25-34</SelectItem>
                <SelectItem value="35-44">35-44</SelectItem>
                <SelectItem value="45-54">45-54</SelectItem>
                <SelectItem value="55+">55+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmitStep1} className="w-full" size="lg">
            Επόμενο Βήμα (Quiz Στυλ)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}