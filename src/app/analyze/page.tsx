// src/app/analyze/page.tsx
"use client";

import { useState, ChangeEvent, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import { useOnboardingStore } from "@/store/onboardingStore";

export default function AnalyzePage() {
  const router = useRouter();

  // Παίρνουμε το store instance για να το χρησιμοποιήσουμε μέσα στο handleSubmit
  const store = useOnboardingStore; 

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [occasion, setOccasion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith("image/")) {
        setError("Παρακαλώ επιλέξτε ένα αρχείο εικόνας (jpeg, png, gif, webp).");
        setSelectedFile(null);
        setPreviewUrl(null);
        event.target.value = ""; 
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError("Το αρχείο είναι πολύ μεγάλο. Μέγιστο επιτρεπτό μέγεθος: 5MB.");
        setSelectedFile(null);
        setPreviewUrl(null);
        event.target.value = ""; 
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, []); 

  const removeSelectedFile = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }, []);


  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!selectedFile) {
      setError("Παρακαλώ ανεβάστε μια φωτογραφία.");
      return;
    }
    if (!occasion.trim()) {
      setError("Παρακαλώ περιγράψτε την περίσταση.");
      return;
    }

    setIsLoading(true);

    // Διαβάζουμε το userData απευθείας από το store ΜΕΣΑ στη συνάρτηση
    const currentDataFromStore = store.getState().userData;

    console.log("Υποβολή για ανάλυση:");
    console.log("Αρχείο:", selectedFile.name, selectedFile.type, selectedFile.size);
    console.log("Περίσταση:", occasion);
    console.log("Δεδομένα Χρήστη από Store (μέσα στο submit):", currentDataFromStore);

    await new Promise(resolve => setTimeout(resolve, 2000));

    router.push(`/results/dummy-analysis-id`);
    
    setIsLoading(false);
  }, [selectedFile, occasion, router, store]); // ΑΦΑΙΡΕΣΑΜΕ το userDataFromStore από τις εξαρτήσεις και προσθέσαμε το store

  return (
    <div className="py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl text-center">Ανέλυσε το Στυλ σου</CardTitle>
          <CardDescription className="text-center">
            Ανέβασε μια φωτογραφία σου και πες μας για ποια περίσταση ετοιμάζεσαι.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="photo-upload" className="font-semibold mb-2 block">Φωτογραφία</Label>
              <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors"
                onClick={() => document.getElementById('photo-upload')?.click()}
                role="button" 
                tabIndex={0} 
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('photo-upload')?.click(); }}
              >
                <div className="space-y-1 text-center">
                  {previewUrl ? (
                    <div className="relative w-48 h-64 mx-auto rounded-md overflow-hidden border">
                       <Image src={previewUrl} alt="Προεπισκόπηση επιλεγμένης εικόνας" layout="fill" objectFit="cover" />
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
                      <div className="flex text-sm text-muted-foreground">
                        <span className="relative rounded-md font-medium text-primary hover:text-primary/80">
                          <span>Ανέβασε ένα αρχείο</span>
                          <Input 
                            id="photo-upload" 
                            name="photo-upload" 
                            type="file" 
                            className="sr-only"
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/gif, image/webp"
                          />
                        </span>
                        <p className="pl-1">ή σύρε κι άφησε</p>
                      </div>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WEBP έως 5MB</p>
                    </>
                  )}
                </div>
              </div>
              {previewUrl && selectedFile && (
                <div className="mt-2 text-sm text-muted-foreground text-center">
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  <Button variant="link" size="sm" onClick={removeSelectedFile} className="ml-2 text-destructive hover:text-destructive/80" type="button">
                    Αφαίρεση
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="occasion" className="font-semibold mb-1 block">Περίσταση</Label>
              <Textarea
                id="occasion"
                placeholder="π.χ., 'Πάω για καφέ με φίλες', 'Συνέντευξη σε startup', 'Βραδινή έξοδος για ποτό'..."
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                rows={3}
                className="resize-none"
                disabled={isLoading}
                aria-required="true"
              />
              <p className="text-xs text-muted-foreground mt-1">Περιέγραψε όσο πιο αναλυτικά γίνεται.</p>
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading || !selectedFile || !occasion.trim()}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Γίνεται Ανάλυση...
                </>
              ) : (
                "Λήψη Ανάλυσης Στυλ"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}