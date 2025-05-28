// src/app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary'; // ✅ Import Cloudinary

// ✅ Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use https
});

interface UserData {
  gender?: string;
  ageGroup?: string;
  stylePreferences?: string[];
}

// Helper function to upload image to Cloudinary
async function uploadImageToCloudinary(imageFile: File): Promise<string | null> {
  try {
    // Cloudinary SDK expects a base64 string or a buffer for upload_stream
    // We need to convert the File object to a buffer first
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          // folder: 'auragenius_uploads', // Optional: organize uploads in a folder
          // public_id: `analysis_${uuidv4()}`, // Optional: custom public_id
          resource_type: 'image', // Specify resource type
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            reject(error);
          } else if (result) {
            console.log('Cloudinary Upload Success:', result.secure_url);
            resolve(result.secure_url); // Return the secure URL of the uploaded image
          } else {
            reject(new Error('Cloudinary upload did not return a result.'));
          }
        }
      );
      // Pipe the buffer to the upload stream
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('Error processing image for Cloudinary upload:', error);
    return null;
  }
}


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const occasion = formData.get('occasion') as string | null;
    const userDataString = formData.get('userData') as string | null;

    let userData: UserData = {};
    if (userDataString) {
      try {
        userData = JSON.parse(userDataString);
      } catch (e) {
        console.error("Failed to parse user data:", e);
        // Decide if this is a critical error
      }
    }

    if (!imageFile) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }
    if (!occasion) {
      return NextResponse.json({ error: 'Occasion is required' }, { status: 400 });
    }

    console.log('Received Image Filename:', imageFile.name);
    console.log('Received Occasion:', occasion);
    console.log('Received User Data:', userData);

    // --- Upload Image to Cloudinary ---
    const imageUrl = await uploadImageToCloudinary(imageFile);

    if (!imageUrl) {
      return NextResponse.json({ error: 'Failed to upload image.' }, { status: 500 });
    }

    console.log('Image uploaded to Cloudinary:', imageUrl);

    // --- Generate Analysis ID ---
    const analysisId = uuidv4();

    // --- (Στο μέλλον) Αποθήκευση analysisId, imageUrl, userData, occasion σε in-memory store ή βάση ---
    // Για τώρα, απλά τα έχουμε διαθέσιμα εδώ.
    // Π.χ., global.analysisStore[analysisId] = { imageUrl, userData, occasion, status: "completed" };

    return NextResponse.json({
      analysisId: analysisId,
      message: 'Analysis request received successfully. Image uploaded.',
      uploadedImageUrl: imageUrl, // Επιστρέφουμε και το URL της εικόνας (προαιρετικά)
    }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/analyze POST handler:', error);
    // Check if the error is a Cloudinary specific error and handle accordingly
    if (error instanceof Error && 'http_code' in error) { // Basic check for Cloudinary error structure
        const cloudinaryError = error as any;
        return NextResponse.json({ error: `Cloudinary error: ${cloudinaryError.message || 'Upload failed'}` }, { status: cloudinaryError.http_code || 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}