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
import NextImage from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store/onboardingStore';
import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward, CheckCircle, ChevronLeft } from 'lucide-react';

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

// --- FULL QUIZ DATA ---
const styleQuizQuestions: QuizQuestion[] = [
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
  const setUserDataInStore = useOnboardingStore((state) => state.setUserData);
  const setCurrentStepInStore = useOnboardingStore((state) => state.setCurrentStep);
  const userGender = useOnboardingStore((state) => state.userData?.gender || "female");
  const initialStylePreferences = useOnboardingStore((state) => state.userData?.stylePreferences || []);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [collectedStyleTags, setCollectedStyleTags] = useState<string[]>(initialStylePreferences);
  const [progressValue, setProgressValue] = useState(0);
  const [direction, setDirection] = useState(0); 
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const currentQuestion: QuizQuestion | undefined = styleQuizQuestions[currentQuestionIndex];

  useEffect(() => {
    if (styleQuizQuestions.length > 0) {
        setProgressValue(((currentQuestionIndex) / styleQuizQuestions.length) * 100);
    }
  }, [currentQuestionIndex]);
  
  const finalizeQuiz = useCallback((finalTags: string[]) => {
    console.log("Onboarding Step 2 - Finalizing with Style Tags:", finalTags);
    setUserDataInStore({ stylePreferences: finalTags });
    setCurrentStepInStore(3);
    router.push('/onboarding/step3');
  }, [setUserDataInStore, setCurrentStepInStore, router]);

  const handleOptionSelect = useCallback((option: QuizOption) => {
    setSelectedOptionId(option.id);
    const newTags = [...new Set([...collectedStyleTags, ...option.styleTags])];
    
    setTimeout(() => {
        setCollectedStyleTags(newTags);
        setSelectedOptionId(null);
        setDirection(1);
        if (currentQuestionIndex < styleQuizQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            finalizeQuiz(newTags);
        }
    }, 300);
  }, [currentQuestionIndex, collectedStyleTags, finalizeQuiz]);

  const handleSkipQuestion = useCallback(() => {
    setDirection(1);
    if (currentQuestionIndex < styleQuizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finalizeQuiz(collectedStyleTags);
    }
  }, [currentQuestionIndex, collectedStyleTags, finalizeQuiz]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
        setDirection(-1);
        setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const getImageUrl = (option: QuizOption | undefined): string => {
    const placeholderPath = "/images/quiz/placeholder_general.jpg";
    if (!option) return placeholderPath;

    let targetUrl = "";
    if (userGender === 'male' && option.imageUrlMale && option.imageUrlMale.trim() !== "") {
      targetUrl = option.imageUrlMale;
    } else if (userGender === 'female' && option.imageUrlFemale && option.imageUrlFemale.trim() !== "") {
      targetUrl = option.imageUrlFemale;
    } else if (option.imageUrlFemale && option.imageUrlFemale.trim() !== "") {
      targetUrl = option.imageUrlFemale;
    } else if (option.imageUrlMale && option.imageUrlMale.trim() !== "") {
      targetUrl = option.imageUrlMale;
    }
    return targetUrl.trim() !== "" ? targetUrl : placeholderPath;
  };

  const quizCardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const questionVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
    center: { zIndex: 1, x: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }},
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 300 : -300, opacity: 0, scale: 0.9, transition: { duration: 0.3, ease: "easeIn" } }),
  };

  const optionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i:number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" } }),
  };

  if (styleQuizQuestions.length === 0) {
      return <div className="container py-10 text-center">Error: No quiz questions loaded. Please ensure `styleQuizQuestions` is populated.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8 px-4 bg-gradient-to-bl from-secondary/10 via-background to-primary/10 overflow-hidden">
      <motion.div
        key="quizCard"
        variants={quizCardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl"
      >
        <Card className="shadow-2xl overflow-hidden">
          <CardHeader className="p-6 border-b">
            <motion.div initial={{ width: "0%" }} animate={{ width: `${progressValue}%` }} transition={{ duration: 0.5, ease: "easeInOut" }}>
                <Progress value={progressValue} className="w-full h-2.5 mb-4 [&>div]:bg-gradient-to-r [&>div]:from-pink-500 [&>div]:to-purple-600" />
            </motion.div>
            
            {currentQuestion ? (
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentQuestionIndex} 
                  custom={direction}
                  variants={questionVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="h-24 flex flex-col justify-center"
                >
                  <CardTitle className="text-xl md:text-2xl font-bold text-center mb-1 tracking-tight">
                    {currentQuestion.question}
                  </CardTitle>
                  <CardDescription className="text-center text-slate-600 dark:text-slate-400">
                    Ερώτηση {currentQuestionIndex + 1} από {styleQuizQuestions.length}
                  </CardDescription>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="h-24 flex items-center justify-center text-muted-foreground">Φόρτωση ερώτησης...</div>
            )}
          </CardHeader>

          {currentQuestion && currentQuestion.options && currentQuestion.options.length > 0 ? (
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                  key={currentQuestionIndex + "-options"} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.2, staggerChildren: 0.07 } }}
                  exit={{ opacity: 0, transition: {duration: 0.1} }}
                  className="min-h-[300px]" // Διασφαλίζει ύψος κατά τις μεταβάσεις
              >
                  <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => {
                      const imageUrl = getImageUrl(option);
                      return (
                        <motion.button
                            key={option.id}
                            custom={index}
                            variants={optionVariants}
                            initial="hidden" // Για να ενεργοποιηθεί το stagger από το γονικό
                            animate="visible"
                            onClick={() => handleOptionSelect(option)}
                            className={`relative group overflow-hidden rounded-xl border-2 p-0.5
                                        ${selectedOptionId === option.id ? 'border-green-500 ring-4 ring-green-500/50' : 'border-transparent hover:border-primary/70'} 
                                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-300 transform will-change-transform`}
                            whileHover={{ y: -5, scale:1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                            whileTap={{ scale: 0.97 }}
                            aria-label={option.label}
                        >
                            <div className="relative aspect-[3/4] w-full">
                                <NextImage
                                    src={imageUrl}
                                    alt={option.label}
                                    fill
                                    sizes="(max-width: 640px) 100vw, 50vw"
                                    className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110"
                                    priority={index < 2}
                                    onError={(e) => { 
                                        console.warn(`Failed to load image: ${imageUrl}. Falling back to general placeholder.`);
                                        (e.target as HTMLImageElement).srcset = '/images/quiz/placeholder_general.jpg';
                                        (e.target as HTMLImageElement).src = '/images/quiz/placeholder_general.jpg';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-300"></div>
                                <p className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white font-semibold text-sm md:text-md text-center drop-shadow-lg">
                                    {option.label}
                                </p>
                                {selectedOptionId === option.id && (
                                    <motion.div 
                                        className="absolute top-3 right-3 bg-green-500 rounded-full p-1.5 text-white shadow-lg"
                                        initial={{scale:0.5, opacity:0}}
                                        animate={{scale:1, opacity:1}}
                                        exit={{scale:0, opacity:0}}
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                    </motion.div>
                                )}
                            </div>
                        </motion.button>
                      );
                  })}
                  </CardContent>
              </motion.div>
            </AnimatePresence>
          ) : (
            <CardContent className="p-4 sm:p-6 flex items-center justify-center min-h-[300px]">
                <p className="text-muted-foreground">Φόρτωση επιλογών...</p>
            </CardContent>
          )}

          <CardFooter className="p-6 flex flex-col sm:flex-row justify-between items-center mt-4 gap-4 border-t">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                    variant="ghost" 
                    onClick={handlePreviousQuestion} 
                    disabled={currentQuestionIndex === 0}
                    className="text-slate-600 dark:text-slate-400 hover:text-primary disabled:opacity-50"
                    aria-label="Προηγούμενη Ερώτηση"
                >
                    <ChevronLeft className="mr-2 w-5 h-5" />
                    Προηγούμενη
                </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                    variant="outline" 
                    onClick={handleSkipQuestion} 
                    className="font-semibold border-dashed hover:border-primary hover:text-primary"
                    aria-label="Παράλειψη Ερώτησης"
                >
                    Παράλειψη
                    <SkipForward className="ml-2 w-5 h-5" />
                </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}