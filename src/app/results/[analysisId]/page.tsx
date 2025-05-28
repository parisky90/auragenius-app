// src/app/results/[analysisId]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { ElementType, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Shirt, Sparkles, Scissors, MessageSquarePlus, Image as ImageIcon, AlertTriangle, Info, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Lottie from "lottie-react";

interface AnalysisResult {
  id: string;
  status: string;
  message: string;
  recommendations: {
    outfit: string[];
    beauty: string[];
    hair: string[];
  };
  aiChatPrompt?: string;
}

interface CategoryConfig {
  title: string;
  Icon: ElementType;
  color: string;
  data: string[] | undefined;
  keyPrefix: string;
}

const AnimatedTextCharacter = ({ text, className, stagger = 0.03, delay = 0 }: { text: string; className?: string; stagger?: number; delay?: number; }) => {
  return (
    <span className={className}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + index * stagger, duration: 0.4, ease: "easeOut" }}
          style={{ display: 'inline-block' }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

export default function ResultsPage() {
  const params = useParams();
  const analysisId = params.analysisId as string;

  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lottieAnimationData, setLottieAnimationData] = useState<object | null>(null);
  const [lottieError, setLottieError] = useState<boolean>(false);

  useEffect(() => {
    fetch('/lottie/aura-loading.json') // Ελέγχει αν υπάρχει το αρχείο στο public/lottie/
      .then(response => {
        if (!response.ok) {
          setLottieError(true);
          console.warn(`Lottie file not found at /lottie/aura-loading.json (status: ${response.status}). Will use fallback spinner.`);
          return null; // Επιστρέφει null για να μην προσπαθήσει να κάνει parse το HTML της 404
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          setLottieAnimationData(data);
          setLottieError(false);
        }
      })
      .catch(err => {
        console.error("Failed to load or parse Lottie animation:", err);
        setLottieError(true);
        setLottieAnimationData(null);
      });
  }, []);

  useEffect(() => {
    if (analysisId) {
      const fetchPageData = async () => {
        setIsLoading(true); setError(null); setResults(null);
        try {
          const response = await fetch(`/api/results/${analysisId}`);
          if (!response.ok) {
            let errorData; try { errorData = await response.json(); } catch (e) { errorData = { error: `Server responded with status: ${response.status}` }; }
            throw new Error(errorData.error || `Failed to fetch results. Status: ${response.status}`);
          }
          const data: AnalysisResult = await response.json();
          setResults(data);
        } catch (err: any) {
          console.error("ResultsPage - Failed to fetch results:", err);
          setError(err.message || 'An unexpected error occurred.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchPageData();
    } else {
      setError("No Analysis ID provided in the URL."); setIsLoading(false);
    }
  }, [analysisId]);

  const pageContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95, rotateX: -10 },
    visible: { 
      opacity: 1, y: 0, scale: 1, rotateX: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.9 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };
  
  const titleCardVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };
  
  const titleTextVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: 0.1, duration: 0.5, type: "spring", stiffness: 100 } },
  };

  const descriptionTextVariants = {
    hidden: { opacity:0, y:10 },
    visible: { opacity:1, y:0, transition: { delay: 0.2, duration:0.4 } },
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {lottieAnimationData && !lottieError ? (
            <Lottie animationData={lottieAnimationData} style={{ width: 200, height: 200, margin: '0 auto' }} loop={true} />
          ) : (
            <div className="w-20 h-20 border-4 border-dashed rounded-full animate-spin border-primary mx-auto mb-4"></div>
          )}
          <h2 className="text-2xl font-semibold mt-6 tracking-tight">
            <AnimatedTextCharacter text="Conjuring Your Aura..." stagger={0.05} />
          </h2>
          <p className="text-muted-foreground mt-2">
            Please wait, genius at work! (ID: {analysisId || "N/A"})
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity:0, y:20}} transition={{ duration: 0.4 }}>
          <Card className="w-full max-w-md shadow-xl border-destructive">
            <CardHeader className="items-center">
              <AlertTriangle className="w-12 h-12 text-destructive mb-2" />
              <CardTitle className="text-destructive text-center text-2xl">Oops! Error Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive-foreground">{error}</p>
              <p className="text-sm text-muted-foreground mt-1">Attempted for ID: <strong>{analysisId || "N/A"}</strong></p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-4">
              <Button variant="secondary" onClick={() => {
                 if (analysisId) {
                    const reFetch = async () => {
                      setIsLoading(true); setError(null); setResults(null);
                      try {
                        const response = await fetch(`/api/results/${analysisId}`);
                        if (!response.ok) {
                          let errorData; try { errorData = await response.json(); } catch (e) { errorData = { error: `Server responded with status: ${response.status}` }; }
                          throw new Error(errorData.error || `Failed to fetch results. Status: ${response.status}`);
                        }
                        const data: AnalysisResult = await response.json(); setResults(data);
                      } catch (err: any) { setError(err.message || 'An unexpected error occurred.');
                      } finally { setIsLoading(false); }
                    };
                    reFetch();
                  }
              }} className="w-full">
                Try Again
              </Button>
              <Link href="/analyze" passHref className="w-full">
                <Button variant="outline" className="w-full">New Analysis</Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!results) { 
    return (
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{opacity:0}} transition={{ duration: 0.4 }}>
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="items-center">
                    <Info className="w-12 h-12 text-muted-foreground mb-2" />
                    <CardTitle className="text-center text-xl">No Results Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>We couldn't find any analysis results for ID: <strong>{analysisId || "N/A"}</strong>.</p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 pt-4">
                    <Link href="/analyze" passHref className="w-full">
                        <Button variant="outline" className="w-full">Start a New Analysis</Button>
                    </Link>
                </CardFooter>
            </Card>
        </motion.div>
      </div>
    );
  }
  
  const categoriesData: CategoryConfig[] = [
    { title: "Outfit Recommendations", Icon: Shirt, color: "text-primary", data: results.recommendations.outfit, keyPrefix: "outfit" },
    { title: "Beauty Product Ideas", Icon: Sparkles, color: "text-pink-500", data: results.recommendations.beauty, keyPrefix: "beauty" },
    { title: "Hair Styling Suggestions", Icon: Scissors, color: "text-purple-500", data: results.recommendations.hair, keyPrefix: "hair" }
  ];

  return (
    <motion.div 
      className="container mx-auto max-w-3xl p-4 md:p-6 space-y-8 md:space-y-10 min-h-screen overflow-x-hidden"
      variants={pageContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={titleCardVariants}>
        <Card className="shadow-2xl overflow-hidden group/titlecard">
          <CardHeader className="text-center bg-gradient-to-br from-primary to-purple-600 p-8 relative">
            <Wand2 className="absolute top-4 left-4 w-8 h-8 text-primary-foreground/30 opacity-0 group-hover/titlecard:opacity-100 transition-opacity duration-500 -rotate-[20deg]" />
            <Sparkles className="absolute bottom-3 right-5 w-10 h-10 text-primary-foreground/40 opacity-0 group-hover/titlecard:opacity-100 transition-opacity duration-500 rotate-[15deg]" />
            
            <motion.div variants={titleTextVariants}>
              <CardTitle className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-200 py-2">
                Your AuraGenius Analysis
              </CardTitle>
            </motion.div>
            <motion.p 
                className="text-md text-primary-foreground/80 pt-2"
                variants={descriptionTextVariants}
            >
              {results.message} (ID: {results.id})
            </motion.p>
          </CardHeader>
        </Card>
      </motion.div>

      {categoriesData.map((category) => {
        const Icon = category.Icon; 
        return (
          <motion.div
            key={category.keyPrefix}
            variants={cardVariants}
            className="will-change-transform"
          >
            <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
              <CardHeader className="pb-4">
                <CardTitle className={`flex items-center text-2xl font-bold ${category.color}`}>
                  {Icon && <Icon className="mr-3 h-8 w-8" aria-hidden="true" />} 
                  <AnimatedTextCharacter text={category.title} className="tracking-tight" />
                </CardTitle>
                <CardDescription className="pt-1 text-sm">Curated ideas for your unique style.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                {category.data && category.data.length > 0 ? (
                  category.data.map((item, itemIndex) => (
                    <motion.div
                      key={`${category.keyPrefix}-${itemIndex}`}
                      variants={itemVariants}
                      initial="hidden" // Επαναφορά initial/animate για τα items
                      animate="visible"
                      whileHover={{ scale: 1.03, x: 5, backgroundColor: "var(--accent)", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-4 p-4 border rounded-xl cursor-pointer will-change-transform"
                      tabIndex={0}
                    >
                      <div className="flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg w-16 h-16 flex items-center justify-center shadow">
                        <ImageIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                      </div>
                      <p className="text-base font-medium flex-1">{item}</p>
                    </motion.div>
                  ))
                ) : <p className="text-muted-foreground p-4 text-center text-sm">No specific {category.keyPrefix.replace(/([A-Z])/g, ' $1').toLowerCase()} recommendations available.</p>}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {results.aiChatPrompt && (
        <motion.div variants={cardVariants} className="will-change-transform">
          <Card className="bg-gradient-to-br from-blue-700/10 via-purple-700/5 to-pink-700/10 shadow-xl border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold text-primary">
                <MessageSquarePlus className="mr-3 h-8 w-8" />
                <AnimatedTextCharacter text="Ready to Explore More?" />
              </CardTitle>
              <CardDescription className="pt-1">Use this prompt with our AI assistant or ask anything!</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-sm bg-background/80 p-4 rounded-lg shadow-inner border border-border">{results.aiChatPrompt}</p>
              <motion.div 
                whileHover={{ scale: 1.02, y: -2, boxShadow: "0px 5px 15px rgba(var(--primary-rgb), 0.3)" }} 
                whileTap={{ scale: 0.98, y: 0 }} 
                className="mt-6"
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
               >
                <Button 
                    className="w-full text-lg py-7 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground font-extrabold shadow-lg tracking-wider" 
                    onClick={() => alert("AI Chat feature coming soon!")}
                >
                  CHAT WITH AURAGENIUS
                  <Sparkles className="ml-3 w-5 h-5 animate-pulse" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Separator className="my-10 md:my-12"/>

      <motion.div
        className="flex flex-col sm:flex-row justify-center items-center gap-4 py-6"
        initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: categoriesData.length * 0.15 + (results.aiChatPrompt ? 0.15 : 0) + 0.5}}
      >
        <Link href="/analyze" passHref className="w-full sm:w-auto">
          <motion.div whileHover={{ scale: 1.08, y: -3, rotate: -1 }} whileTap={{ scale: 0.92 }}>
            <Button variant="outline" className="w-full text-md py-5 border-2 hover:bg-accent/80 font-semibold px-8">
                New Analysis
            </Button>
          </motion.div>
        </Link>
        <Link href="/" passHref className="w-full sm:w-auto">
          <motion.div whileHover={{ scale: 1.08, y: -3, rotate: 1 }} whileTap={{ scale: 0.92 }}>
            <Button variant="ghost" className="w-full text-md py-5 text-muted-foreground hover:text-primary font-semibold px-8">
                Back to Home
            </Button>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
}