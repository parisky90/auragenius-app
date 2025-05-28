// src/app/onboarding/page.tsx
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
import { motion, AnimatePresence } from 'framer-motion';
import { User, CalendarDays, ArrowRight } from 'lucide-react'; // Icons

export default function OnboardingPage() {
  const router = useRouter();
  const { setUserData, setCurrentStep, userData } = useOnboardingStore();

  const [gender, setGender] = useState<string | undefined>(userData?.gender);
  const [ageGroup, setAgeGroup] = useState<string | undefined>(userData?.ageGroup);
  const [isGenderSelected, setIsGenderSelected] = useState(!!userData?.gender);
  const [isAgeSelected, setIsAgeSelected] = useState(!!userData?.ageGroup);

  const handleSubmitStep1 = () => {
    if (gender && ageGroup) {
      setUserData({ gender, ageGroup });
      setCurrentStep(2);
      router.push('/onboarding/step2');
    } else {
      // Εδώ θα μπορούσες να χρησιμοποιήσεις toast notifications αντί για alert
      if (!gender) alert("Παρακαλώ επιλέξτε το φύλο σας.");
      else if (!ageGroup) alert("Παρακαλώ επιλέξτε την ηλικιακή σας ομάδα.");
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  const itemVariants = (delay: number) => ({
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { delay, duration: 0.5, ease: "easeOut" } },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg"
      >
        <Card className="shadow-2xl overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50 p-6 text-center border-b">
            <motion.div variants={itemVariants(0.1)}>
              <User className="w-12 h-12 text-primary mx-auto mb-3" />
            </motion.div>
            <motion.div variants={itemVariants(0.2)}>
              <CardTitle className="text-3xl font-extrabold tracking-tight">
                Λίγα Λόγια για Εσάς
              </CardTitle>
            </motion.div>
            <motion.div variants={itemVariants(0.3)}>
              <CardDescription className="text-md pt-1 text-slate-600 dark:text-slate-400">
                Αυτό θα μας βοηθήσει να εξατομικεύσουμε τις προτάσεις μας.
                <span className="block font-semibold text-primary mt-1">(Βήμα 1 από 3)</span>
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-8">
            <motion.div variants={itemVariants(0.4)} className="space-y-3">
              <Label htmlFor="gender" className="text-lg font-semibold flex items-center">
                <User className="w-5 h-5 mr-2 text-primary/80" />
                Φύλο
              </Label>
              <RadioGroup
                id="gender"
                onValueChange={(value) => { setGender(value); setIsGenderSelected(true); }}
                value={gender}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1"
              >
                {['female', 'male', 'other'].map((option, index) => (
                  <motion.div 
                    key={option}
                    whileHover={{ scale: 1.05, y: -2 }} 
                    whileTap={{ scale: 0.95 }}
                    className="w-full"
                  >
                    <Label
                      htmlFor={option}
                      className={`flex items-center justify-center space-x-2 border-2 rounded-lg p-3 cursor-pointer transition-all duration-200
                        ${gender === option 
                          ? 'border-primary bg-primary/10 ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900' 
                          : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50'
                        }`}
                    >
                      <RadioGroupItem value={option} id={option} className="sr-only" />
                      <span className={`font-medium ${gender === option ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>
                        {option === 'female' ? 'Γυναίκα' : option === 'male' ? 'Άνδras' : 'Άλλο'}
                      </span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </motion.div>

            <motion.div variants={itemVariants(0.5)} className="space-y-3">
              <Label htmlFor="age-group" className="text-lg font-semibold flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-primary/80" />
                Ηλικιακή Ομάδα
              </Label>
              <Select onValueChange={(value) => { setAgeGroup(value); setIsAgeSelected(true); }} value={ageGroup}>
                <SelectTrigger 
                  id="age-group" 
                  className={`w-full h-12 text-base transition-all duration-200 
                    ${ageGroup ? 'border-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900' : 'hover:border-primary/50'}`}
                >
                  <SelectValue placeholder="Επιλέξτε ηλικιακή ομάδα..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45-54">45-54</SelectItem>
                  <SelectItem value="55+">55+</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </CardContent>
          <CardFooter className="p-6 sm:p-8">
            <motion.div 
              variants={itemVariants(0.6)} 
              className="w-full"
              whileHover={ (gender && ageGroup) ? { scale: 1.03 } : {}}
              whileTap={ (gender && ageGroup) ? { scale: 0.97 } : {}}
            >
              <Button 
                onClick={handleSubmitStep1} 
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-lg disabled:opacity-60 disabled:cursor-not-allowed" 
                disabled={!gender || !ageGroup}
                aria-label="Επόμενο Βήμα, Quiz Στυλ"
              >
                Επόμενο Βήμα
                <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}