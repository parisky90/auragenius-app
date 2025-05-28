// src/app/api/results/[analysisId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ analysisId: string }> | { analysisId: string } } // Τροποποίηση τύπου για ευελιξία
) {
  let analysisId: string | undefined;

  // Προσπαθούμε να διαχειριστούμε και τις δύο περιπτώσεις (Promise ή άμεσο object)
  // για τα params, αν και το Next.js συνήθως παρέχει άμεσο object.
  if (context.params && typeof (context.params as Promise<{ analysisId: string }>).then === 'function') {
    // Μοιάζει με Promise, οπότε κάνουμε await
    console.log('[API /api/results/[analysisId]] Params object looks like a Promise, awaiting...');
    try {
      const resolvedParams = await (context.params as Promise<{ analysisId: string }>);
      analysisId = resolvedParams.analysisId;
    } catch (err) {
      console.error('[API /api/results/[analysisId]] Error awaiting params Promise:', err);
      return NextResponse.json({ error: 'Failed to resolve route parameters.' }, { status: 500 });
    }
  } else if (context.params && typeof (context.params as { analysisId: string }).analysisId === 'string') {
    // Μοιάζει με άμεσο object
    console.log('[API /api/results/[analysisId]] Params object is direct, accessing analysisId.');
    analysisId = (context.params as { analysisId: string }).analysisId;
  } else {
    console.error('[API /api/results/[analysisId]] Error: Params object is not in expected format.');
    return NextResponse.json({ error: 'Invalid route parameter structure.' }, { status: 500 });
  }
  
  if (!analysisId || typeof analysisId !== 'string' || analysisId.trim() === '') {
    console.error(`[API /api/results/[analysisId]] Error: Invalid or missing Analysis ID after processing params. Received: ${analysisId}`);
    return NextResponse.json({ error: 'Valid Analysis ID is required in the path.' }, { status: 400 });
  }

  console.log(`[API /api/results/[analysisId]] GET request for analysisId: ${analysisId}`);

  await new Promise(resolve => setTimeout(resolve, 1000));

  const dummyData: AnalysisResult = {
    id: analysisId,
    status: "completed",
    message: `Your personalized style recommendations for ID: ${analysisId} are ready!`,
    recommendations: {
      outfit: [ `Outfit Suggestion Alpha for ${analysisId}`, "A classic leather jacket.", "Dark wash denim jeans.", "Chelsea boots." ],
      beauty: [ "Consider a subtle smoky eye.", `Recommended moisturizer brand X for analysis ${analysisId}.` ],
      hair: [ "A textured crop hairstyle.", `Hair product Y, suitable for the occasion of ${analysisId}.` ]
    },
    aiChatPrompt: `Tell me more about the leather jacket for analysis ${analysisId}. What are some good brands?`
  };

  console.log(`[API /api/results/[analysisId]] Successfully prepared dummy data for ID: ${analysisId}`);
  return NextResponse.json(dummyData, { status: 200 });
}