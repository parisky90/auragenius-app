// src/app/results/[analysisId]/page.tsx
"use client";
import { useParams } from 'next/navigation';

export default function ResultPage() {
  const params = useParams();
  const analysisId = params.analysisId;

  return (
    <div className="container py-10 text-center">
      <h1 className="text-3xl font-bold">Αποτελέσματα Ανάλυσης</h1>
      <p className="mt-4">Analysis ID: {typeof analysisId === 'string' ? analysisId : JSON.stringify(analysisId)}</p>
      <p className="mt-2">Τα πραγματικά αποτελέσματα θα εμφανιστούν εδώ σύντομα!</p>
    </div>
  );
}