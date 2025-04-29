import { NextResponse } from 'next/server';
import { findSimilarPins } from '@/lib/ai/vertex/matching';
import { generateImageVector } from '@/lib/ai/vision';
import fs from 'fs/promises';
import path from 'path';

export async function POST() {
  try {
    console.log('Starting POST request...');
    
    // Use a test image from your public folder
    const testImagePath = path.join(process.cwd(), 'public/uploads', 'test-outfit.jpeg');
    console.log('Test image path:', testImagePath);
    
    const imageBuffer = await fs.readFile(testImagePath);
    console.log('Image buffer loaded successfully');
    
    // Generate vector
    let testVector;
    try {
      console.log('Generating vector...');
      testVector = await generateImageVector(imageBuffer);
      console.log('Generated vector:', testVector.length, 'dimensions');
    } catch (error) {
      console.error('Error generating vector:', error);
      throw error;
    }
    
    // Test with different boardSlugs
    const boardSlug = 'bohemian-daydream';
    let similarPins;
    try {
      console.log('Finding similar pins...');
      similarPins = await findSimilarPins(testVector, boardSlug);
      console.log('Found similar pins:', similarPins.length);
    } catch (error) {
      console.error('Error finding similar pins:', error);
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      testImage: 'test-outfit.jpg',
      boardSlug,
      similarPinsCount: similarPins.length,
      samplePins: similarPins.slice(0, 3)
    });
    
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}