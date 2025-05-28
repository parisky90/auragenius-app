// src/app/analyze/page.tsx
'use client';

import { useState, FormEvent } from 'react'; // Αφαίρεσα το useCallback αν δεν χρησιμοποιείται
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store/onboardingStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AnalyzePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [occasion, setOccasion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const userData = useOnboardingStore((state) => state.userData);
  // console.log("User Data in AnalyzePage (on load):", userData); // Μπορείς να το κρατήσεις για debug

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log("User Data on Submit:", userData); // Για debug

    if (!imageFile || !occasion) {
      toast.error('Please upload an image and describe the occasion.');
      return;
    }

    if (!userData || Object.keys(userData).length === 0 || (!userData.gender && !userData.ageGroup)) {
        toast.error('User data from onboarding is missing. Please complete onboarding first.');
        return;
    }

    setIsLoading(true);
    toast.info('Starting analysis...');

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('occasion', occasion);
    formData.append('userData', JSON.stringify(userData));

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log("API Response Data from /api/analyze (AnalyzePage):", result); // ✅ DEBUG LOG

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong with the analysis.');
      }

      toast.success(result.message || 'Analysis request submitted successfully!');
      
      if (result && result.analysisId) { // Πρόσθεσα έλεγχο και για το result
        console.log(`Redirecting to /results/${result.analysisId}`); // ✅ DEBUG LOG
        router.push(`/results/${result.analysisId}`);
      } else {
        toast.error('Could not get Analysis ID from API response. Please try again.');
        console.error("Analysis ID missing from successful API response or result is null/undefined:", result);
      }

    } catch (error: any) {
      console.error('Error submitting analysis:', error);
      toast.error(error.message || 'Failed to submit analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Analyze Your Style</CardTitle>
          <CardDescription className="text-center">
            Upload a photo of yourself and tell us the occasion.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image-upload">Upload Photo</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                disabled={isLoading}
              />
              {imagePreview && (
                <div className="mt-4">
                  <img src={imagePreview} alt="Selected preview" className="mx-auto max-h-60 rounded-md" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="occasion">Occasion</Label>
              <Textarea
                id="occasion"
                placeholder="e.g., Casual outing, Formal dinner, Wedding guest"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading || !imageFile || !occasion.trim()}>
              {isLoading ? 'Analyzing...' : 'Get My Aura'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}