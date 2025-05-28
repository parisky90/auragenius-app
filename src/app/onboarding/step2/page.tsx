// src/app/onboarding/step2/page.tsx
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
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store/onboardingStore';
// Δεν θα χρησιμοποιήσουμε το shallow εδώ, θα πάρουμε τις τιμές πιο επιλεκτικά

// --- Interfaces for Quiz Data ---
interface QuizOption {
  id: string;
  label: string;
  imageUrlMale: string;
  imageUrlFemale: string;
  styleTags: string[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

// --- FULL QUIZ DATA (Αντιγράφεις εδώ ΟΛΟΚΛΗΡΟ το styleQuizQuestions array) ---
const styleQuizQuestions: QuizQuestion[] = [
  // ΕΡΩΤΗΣΗ 1
  {
    id: "q1",
    question: "Πώς θα περιέγραφες το ιδανικό σου καθημερινό ντύσιμο για μια χαλαρή μέρα;",
    options: [
      { id: "q1o1", label: "Άνετο & Casual", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["casual", "comfortable", "everyday", "relaxed", "jeans", "tshirt", "sneakers"] },
      { id: "q1o2", label: "Sporty / Athleisure", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["sporty", "athleisure", "active", "comfortable", "tracksuit", "hoodie"] },
      { id: "q1o3", label: "Chic & Περιποιημένο Casual", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["chic_casual", "smart_casual", "put_together", "effortless_elegance", "blazer_casual"] },
      { id: "q1o4", label: "Streetwear / Urban", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["streetwear", "urban", "modern_casual", "graphic_tees", "sneakerhead"] },
    ],
  },
  // ΕΡΩΤΗΣΗ 2
  {
    id: "q2",
    question: "Σε ένα επαγγελματικό περιβάλλον, ποιο στυλ σε αντιπροσωπεύει καλύτερα;",
    options: [
      { id: "q2o1", label: "Business Formal (Κοστούμι/Ταγιέρ)", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["business_formal", "professional", "corporate", "suit", "power_dressing", "formal_shirt"] },
      { id: "q2o2", label: "Business Casual (Κομψό & Άνετο)", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["business_casual", "smart_casual", "office_wear", "chic_work", "blouse", "chinos", "loafers"] },
      { id: "q2o3", label: "Creative / Startup (Μοντέρνο & Άνετο)", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["creative_professional", "startup_style", "modern_office", "relaxed_professional", "stylish_workwear"] },
      { id: "q2o4", label: "Minimalist Professional", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["minimalist_professional", "sleek_office", " understated_elegance", "neutral_workwear"] },
    ],
  },
  // ΕΡΩΤΗΣΗ 3
  {
    id: "q3",
    question: "Για μια βραδινή έξοδο (π.χ. ποτό με φίλους, δείπνο), τι θα επέλεγες;",
    options: [
      { id: "q3o1", label: "Elegant & Classic", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["elegant_evening", "classic_nightout", "timeless_chic", "sophisticated_dress", "smart_shirt_trousers"] },
      { id: "q3o2", label: "Glamorous / Statement", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["glamorous", "statement_evening", "sequins", "velvet", "dress_to_impress", "bold_look"] },
      { id: "q3o3", label: "Edgy / Rock Chic", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["edgy_evening", "rock_chic_night", "leather_look", "dark_colors_night", "alternative_glam"] },
      { id: "q3o4", label: "Casual Cool / Χαλαρό Βραδινό", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["casual_night_out", "relaxed_evening_style", "jeans_and_nice_top_man", "effortless_cool_night", "stylish_comfort_night"] },
    ],
  },
  // ΕΡΩΤΗΣΗ 4
  {
    id: "q4",
    question: "Για μια επίσημη περίσταση όπως ένας γάμος ή μια βάφτιση, τι είδους εμφάνιση προτιμάς;",
    options: [
      { id: "q4o1", label: "Κλασική Επίσημη", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["classic_formal_event", "wedding_guest_classic", "long_dress", "tailored_suit_event"] },
      { id: "q4o2", label: "Μοντέρνα Επίσημη", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["modern_formal_event", "cocktail_attire", "contemporary_suit", "chic_event_guest"] },
      { id: "q4o3", label: "Boho / Ρομαντική Επίσημη", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["boho_formal", "romantic_event_style", "flowy_dress_formal", "linen_suit_event"] },
      { id: "q4o4", label: "Statement / Μοναδική Επίσημη", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["statement_formal", "unique_event_outfit", "bold_formal_choice", "avant_garde_formal"] },
    ],
  },
  // ΕΡΩΤΗΣΗ 5
  {
    id: "q5",
    question: "Ποιο από τα παρακάτω πιο ιδιαίτερα στυλ αισθάνεσαι ότι σε εκφράζει ή θα ήθελες να εξερευνήσεις;",
    options: [
      { id: "q5o1", label: "Bohemian / Free Spirit", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["bohemian", "boho_chic", "free_spirited", "festival_fashion", "eclectic_prints", "natural_fabrics"] },
      { id: "q5o2", label: "Western / Cowboy-Cowgirl", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["western_style", "cowboy_boots", "cowgirl_chic", "denim_on_denim", "fringe_details"] },
      { id: "q5o3", label: "Vintage / Retro (π.χ. '70s, '90s)", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["vintage_inspired", "retro_look", "70s_flair", "90s_grunge_revival", "Y2K_fashion"] },
      { id: "q5o4", label: "Goth / Dark Academia / Alternative", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["goth_style", "dark_academia_aesthetic", "alternative_fashion", "dark_moody_style", "lace_velvet"] },
      { id: "q5o5", label: "Preppy / Κολεγιακό", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["preppy_style", "collegiate_look", "ivy_league_fashion", "classic_american_sportswear"] },
      { id: "q5o6", label: "Artsy / Εκλεκτικό", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["artsy_fashion", "eclectic_style", "bold_patterns_colors", "unique_pieces", "creative_expression"] },
    ],
  },
  // ΕΡΩΤΗΣΗ 6
  {
    id: "q6",
    question: "Ποιες χρωματικές παλέτες κυριαρχούν ή θα ήθελες να κυριαρχούν στην γκαρνταρόμπα σου;",
    options: [
      { id: "q6o1", label: "Ουδέτερα (Μαύρο, Άσπρο, Γκρι, Μπεζ)", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["neutral_palette", "monochromatic_look", "black_and_white", "beige_tones", "earthy_colors"] },
      { id: "q6o2", label: "Έντονα & Ζωηρά Χρώματα", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["bright_color_palette", "bold_statements", "color_blocking_style", "vibrant_hues", "energetic_colors"] },
      { id: "q6o3", label: "Παστέλ & Απαλές Αποχρώσεις", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["pastel_palette", "soft_colors", "light_airy_tones", "romantic_shades", "muted_colors"] },
      { id: "q6o4", label: "Σκούρες & Βαθιές Αποχρώσεις (Πέραν του μαύρου)", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["dark_color_palette", "deep_jewel_tones", "moody_colors_style", "rich_burgundy_forest_green_navy"] },
    ],
  },
  // ΕΡΩΤΗΣΗ 7
  {
    id: "q7",
    question: "Ποια υφάσματα και υφές σε ελκύουν περισσότερο;",
    options: [
      { id: "q7o1", label: "Φυσικά & Άνετα (Βαμβάκι, Λινό, Μαλλί)", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["natural_fabrics", "cotton_lover", "linen_style", "wool_comfort", "breathable_materials"] },
      { id: "q7o2", label: "Πολυτελή & Απαλά (Μετάξι, Κασμίρ, Βελούδο)", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["luxury_fabrics", "silk_touch", "cashmere_softness", "velvet_texture", "satin_shine"] },
      { id: "q7o3", label: "Denim (Σε όλες τις μορφές του)", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["denim_lover", "jeans_everyday", "denim_jacket_style", "double_denim"] },
      { id: "q7o4", label: "Δέρμα & Δερματίνη (Ροκ & Μοντέρνο)", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["leather_look", "faux_leather_style", "rock_vibe_texture", "modern_edgy_fabric"] },
    ],
  },
  // ΕΡΩΤΗΣΗ 8
  {
    id: "q8",
    question: "Όταν πρόκειται για prints και μοτίβα, τι προτιμάς;",
    options: [
      { id: "q8o1", label: "Μονόχρωμα / Απουσία Prints", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["solid_colors", "no_prints", "minimal_pattern", "classic_plain"] },
      { id: "q8o2", label: "Διακριτικά & Κλασικά (Ρίγες, Πουά, Μικρά Καρό)", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["classic_prints", "stripes_style", "polka_dots_lover", "subtle_gingham_plaid"] },
      { id: "q8o3", label: "Έντονα & Μοντέρνα (Floral, Animal Print, Abstract)", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["bold_prints", "floral_fashion", "animal_print_lover", "abstract_patterns", "statement_graphics"] },
      { id: "q8o4", label: "Geometrics / Γεωμετρικά Σχέδια", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["geometric_prints", "modern_patterns", "structured_designs", "optical_prints"] },
    ],
  },
  // ΕΡΩΤΗΣΗ 9
  {
    id: "q9",
    question: "Ποια αξεσουάρ θεωρείς απαραίτητα ή αγαπάς να προσθέτεις στα σύνολά σου;",
    options: [
      { id: "q9o1", label: "Statement Κοσμήματα", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["statement_jewelry", "bold_necklace", "large_earrings", "accessorizing_focus_jewelry", "men_jewelry_chains_rings"] },
      { id: "q9o2", label: "Καπέλα & Γυαλιά Ηλίου", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["hat_lover", "sunglasses_addict", "headwear_style", "finishing_touch_accessories", "beanies_caps_fedoras"] },
      { id: "q9o3", label: "Τσάντες (Πρακτικές ή Statement)", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["bag_collector", "stylish_handbags", "functional_backpacks_man", "statement_purse", "crossbody_tote_clutch"] },
      { id: "q9o4", label: "Ζώνες & Φουλάρια/Μαντήλια", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["belt_style", "scarf_lover", "neckwear_fashion", "waist_cinching_accessories", "pocket_squares_ties_man"] },
    ],
  },
  // ΕΡΩΤΗΣΗ 10
  {
    id: "q10",
    question: "Όταν ντύνεσαι, το πιο σημαντικό για σένα είναι να νιώθεις:",
    options: [
      { id: "q10o1", label: "Άνετα & Χαλαρά", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["comfort_is_key", "relaxed_vibe", "easygoing_style", "unrestricted_fashion"] },
      { id: "q10o2", label: "Με Αυτοπεποίθηση & Δυναμισμό", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["confidence_booster_style", "power_dressing_feeling", "empowered_by_fashion", "assertive_look"] },
      { id: "q10o3", label: "Κομψά & Περιποιημένα", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["elegant_feeling", "put_together_vibe", "sophisticated_aura", "polished_look"] },
      { id: "q10o4", label: "Δημιουργικά & Μοναδικά", imageUrlMale: "/images/quiz/male/placeholder.jpg", imageUrlFemale: "/images/quiz/female/placeholder.jpg", styleTags: ["creative_expression_style", "unique_fashion_identity", "individualistic_look", "artistic_vibe"] },
    ],
  },
];
// --- END OF QUIZ DATA ---

export default function OnboardingStep2Page() {
  const router = useRouter();
  
  // Παίρνουμε τις συναρτήσεις από το store μία φορά
  const setUserDataInStore = useOnboardingStore((state) => state.setUserData);
  const setCurrentStepInStore = useOnboardingStore((state) => state.setCurrentStep);
  const userGender = useOnboardingStore((state) => state.userData?.gender || "female");
  const initialStylePreferences = useOnboardingStore((state) => state.userData?.stylePreferences || []);


  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [collectedStyleTags, setCollectedStyleTags] = useState<string[]>(initialStylePreferences);
  const [progressValue, setProgressValue] = useState(0);

  const currentQuestion: QuizQuestion | undefined = styleQuizQuestions[currentQuestionIndex];

  useEffect(() => {
    if (styleQuizQuestions.length > 0) {
        setProgressValue(((currentQuestionIndex) / styleQuizQuestions.length) * 100);
    } else {
        setProgressValue(0);
    }
  }, [currentQuestionIndex]);
  
  // Αυτή η συνάρτηση καλείται όταν το quiz ολοκληρώνεται (είτε με απάντηση στην τελευταία ερώτηση είτε με skip)
  const finalizeQuiz = useCallback((finalTags: string[]) => {
    console.log("Onboarding Step 2 - Finalizing with Style Tags:", finalTags);
    setUserDataInStore({ stylePreferences: finalTags });
    setCurrentStepInStore(3);
    router.push('/onboarding/step3'); // ή '/profile'
  }, [setUserDataInStore, setCurrentStepInStore, router]);


  const handleOptionSelect = useCallback((optionTags: string[]) => {
    const newTags = [...new Set([...collectedStyleTags, ...optionTags])];
    setCollectedStyleTags(newTags);
    
    if (currentQuestionIndex < styleQuizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finalizeQuiz(newTags); // Ολοκλήρωση με τα ενημερωμένα tags
    }
  }, [currentQuestionIndex, collectedStyleTags, finalizeQuiz]); // Το finalizeQuiz είναι τώρα σταθερό


  const handleSkipQuestion = useCallback(() => {
    if (currentQuestionIndex < styleQuizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Αν είναι η τελευταία ερώτηση και κάνει skip, finalize με τα tags που έχουν μαζευτεί ως τώρα
      finalizeQuiz(collectedStyleTags);
    }
  }, [currentQuestionIndex, collectedStyleTags, finalizeQuiz]); // Το finalizeQuiz είναι τώρα σταθερό


  const getImageUrl = (option: QuizOption): string => {
    const placeholderPath = "/images/quiz/placeholder_general.jpg"; 
    if (!option) return placeholderPath;

    // Χρησιμοποιούμε το userGender που πήραμε από το store στην αρχή
    if (userGender === 'male' && option.imageUrlMale && option.imageUrlMale.trim() !== "") {
      return option.imageUrlMale;
    }
    if (option.imageUrlFemale && option.imageUrlFemale.trim() !== "") {
        return option.imageUrlFemale;
    }
    return placeholderPath;
  };

  if (styleQuizQuestions.length === 0) {
      return <div className="container py-10 text-center">Δεν υπάρχουν διαθέσιμες ερωτήσεις για το quiz.</div>;
  }
  if (!currentQuestion) {
    // Αυτό συνήθως σημαίνει ότι το quiz έχει ολοκληρωθεί και η finalizeQuiz έχει ήδη καλεστεί
    // ή υπάρχει κάποιο σφάλμα αν το currentQuestionIndex είναι εκτός ορίων.
    // Μπορούμε να δείξουμε ένα μήνυμα φόρτωσης ή ανακατεύθυνσης.
    return <div className="container py-10 text-center">Ολοκλήρωση quiz...</div>;
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-6 sm:py-10">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <Progress value={progressValue} className="w-full mb-4 h-2" aria-label="Πρόοδος Quiz" />
          <CardTitle className="text-xl sm:text-2xl text-center mb-1">{currentQuestion.question}</CardTitle>
          <CardDescription className="text-center">
            Επίλεξε την εικόνα που σε εκφράζει περισσότερο. (Ερώτηση {currentQuestionIndex + 1} από {styleQuizQuestions.length})
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.styleTags)}
              className="relative group overflow-hidden rounded-lg border-2 border-transparent hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
              aria-label={option.label}
            >
              <Image
                src={getImageUrl(option)}
                alt={option.label}
                width={300}
                height={400}
                className="object-cover w-full h-auto aspect-[3/4] transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105"
                priority={currentQuestionIndex < 1}
                onError={(e) => { 
                  (e.target as HTMLImageElement).srcset = '/images/quiz/placeholder_general.jpg';
                  (e.target as HTMLImageElement).src = '/images/quiz/placeholder_general.jpg';
                 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity group-hover:opacity-75"></div>
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                <p className="text-white font-semibold text-xs sm:text-sm text-center drop-shadow-md">{option.label}</p>
              </div>
            </button>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3 sm:gap-4">
          <Button variant="outline" onClick={handleSkipQuestion} className="w-full sm:w-auto">
            Παράλειψη Ερώτησης
          </Button>
          <div className="text-sm text-muted-foreground">
            Βήμα 2 από 3 (Quiz Στυλ)
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}