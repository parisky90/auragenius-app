// src/app/onboarding/page.tsx
"use client"; // Σημαντικό γιατί θα χρησιμοποιήσουμε state και event handlers

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
import { useState } from "react";
// import { useOnboardingStore } from '@/store/onboardingStore'; // Θα το φτιάξουμε μετά

export default function OnboardingPage() {
  const [gender, setGender] = useState<string | undefined>();
  const [ageGroup, setAgeGroup] = useState<string | undefined>();
  // const { setGender, setAgeGroup, nextStep } = useOnboardingStore(); // Από το Zustand store

  const handleSubmitStep1 = () => {
    if (gender && ageGroup) {
      console.log("Step 1 Data:", { gender, ageGroup });
      // setGender(gender);
      // setAgeGroup(ageGroup);
      // nextStep();
      // router.push('/onboarding/step2'); // Ή όπως θα διαχειριστούμε τα steps
    } else {
      alert("Please select both gender and age group.");
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Tell Us About Yourself</CardTitle>
          <CardDescription>
            This will help us personalize your style recommendations. (Step 1 of 3)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <RadioGroup
              id="gender"
              onValueChange={setGender}
              value={gender}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age-group">Age Group</Label>
            <Select onValueChange={setAgeGroup} value={ageGroup}>
              <SelectTrigger id="age-group">
                <SelectValue placeholder="Select your age group" />
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
          <Button onClick={handleSubmitStep1} className="w-full">
            Next Step
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}