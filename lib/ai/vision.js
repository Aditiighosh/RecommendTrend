// Import Google's Vision API client
// This is like hiring a professional fashion analyst who can look at images and tell us what's in them
import { ImageAnnotatorClient } from '@google-cloud/vision';
import {FASHION_DICTIONARY} from './fashionDictionary.js' ;// Import our fashion dictionary for labels

// Create our analyst (client) that we'll ask to examine images
// Notice we don't need credentials here - they're automatically detected from your Google Cloud environment
const visionClient = new ImageAnnotatorClient();

// These are like "recipe settings" for how we want our fashion analysis done
const VECTOR_FEATURES = {
  MAX_COLORS: 5,          // We only care  about the top 5 dominant colors in an outfit
  NORMALIZE: true,        // Scale color values to 0-1 range (like turning volume knobs to percentage)
  INCLUDE_LABELS: true,   // Should we note clothing types? (dress, pants, etc.)
  INCLUDE_OBJECTS: true   // Should we look for specific items? (handbags, shoes)
};

/**
 * Analyzes an outfit like a personal stylist would
 * @param {Buffer} imageBuffer - The image file's raw data
 * @returns {Object} Analysis report with labels, colors, and accessories (including bounding boxes)
 */
export async function analyzeOutfit(imageBuffer) {
  try {
    // Ask the Vision API to examine the image
    const [result] = await visionClient.annotateImage({
      image: { content: imageBuffer },
      features: [
        { type: 'LABEL_DETECTION', maxResults: 20 },      // Get up to 20 clothing labels
        { type: 'IMAGE_PROPERTIES' },                     // Color information
        { type: 'OBJECT_LOCALIZATION', maxResults: 15 }   // Locate up to 15 fashion items
      ]
    });

    // Package the results in an easy-to-understand format
    return {
      // Clothing labels with confidence over 70% only
      labels: result.labelAnnotations
        ?.filter(l => l.score > 0.7)                      // Only keep confident labels
        .map(l => {
          // Find the bounding box for the label (if available)
          const matchingObject = result.localizedObjectAnnotations?.find(
            o => o.name.toLowerCase() === l.description.toLowerCase()
          );

          return {
            name: l.description,                          // e.g., "dress", "denim jacket"
            confidence: l.score,                          // How sure the API is (0-1)
            boundingBox: matchingObject?.boundingPoly?.normalizedVertices || null // Bounding box
          };
        }) || [],                                         // Default to empty array if nothing found

      // The top 5 dominant colors with their coverage percentage
      colors: result.imagePropertiesAnnotation?.dominantColors?.colors
        .slice(0, VECTOR_FEATURES.MAX_COLORS)             // Take only top colors
        .map(c => ({
          rgb: [c.color.red, c.color.green, c.color.blue], // Actual color values
          coverage: c.pixelFraction                        // How much of the image uses this color
        })) || [],

      // Detected fashion items with confidence over 80%
      objects: result.localizedObjectAnnotations
        ?.filter(o => o.score > 0.8)                      // Only strong detections
        .map(o => ({
          name: o.name,                                   // e.g., "Handbag", "Sunglasses"
          confidence: o.score,
          boundingBox: o.boundingPoly.normalizedVertices  // Where the item is in the image
        })) || []
    };
  } catch (error) {
    console.error('Outfit analysis failed:', error);
    throw new Error(`Vision API error: ${error.message}`);
  }
}

/**
 * Creates a 512-dimensional "fingerprint" (vector) of the image based on its dominant colors.
 * @param {Buffer} imageBuffer - Image file data
 * @returns {Array} Numerical vector with exactly 512 dimensions
 */
export async function generateImageVector(imageBuffer) {
  // Safety check - is this actually an image file?
  if (!Buffer.isBuffer(imageBuffer)) {
    throw new Error('Input must be a valid image buffer - like giving the stylist a photo, not a document');
  }

  try {
    // Get detailed analysis from Vision API
    const [result] = await visionClient.annotateImage({
      image: { content: imageBuffer },
      features: [
        { type: 'IMAGE_PROPERTIES' } // Only request color data
      ]
    });

    // --- Process Colors ---
    const colorVector = result.imagePropertiesAnnotation?.dominantColors?.colors
      .slice(0, VECTOR_FEATURES.MAX_COLORS) // Take top colors
      .flatMap(c => {
        const rgb = [c.color.red, c.color.green, c.color.blue];
        return VECTOR_FEATURES.NORMALIZE 
          ? rgb.map(v => v / 255)  // Convert 0-255 → 0-1
          : rgb;                   // Or keep original values
      }) || [];

    // Ensure the vector has exactly 512 dimensions
    const FIXED_VECTOR_LENGTH = 512;
    const paddedOrTruncatedVector = colorVector
      .concat(Array(FIXED_VECTOR_LENGTH).fill(0)) // Pad with zeros if too short
      .slice(0, FIXED_VECTOR_LENGTH);             // Truncate if too long

    console.log('Final 512-dimensional vector:', paddedOrTruncatedVector);

    if (paddedOrTruncatedVector.length !== FIXED_VECTOR_LENGTH) {
      throw new Error('Vector length mismatch - something went wrong during padding/truncation');
    }

    return paddedOrTruncatedVector;
  } catch (error) {
    console.error('Vector generation failed:', error);
    throw new Error(`Vector generation error: ${error.message}`);
  }
}

/*
 * Helper function to analyze images directly from URLs
 * @param {string} imageUrl - Publicly accessible image URL
 * @returns {Array} Image feature vector
 */
/*export async function generateImageVectorFromUrl(imageUrl) {
  try {
    // Download the image first (like saving a Pinterest pin to your device)
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    
    // Then analyze it using our main function
    return generateImageVector(Buffer.from(buffer));
  } catch (error) {
    console.error('URL image processing failed:', error);
    throw new Error(`Image download error: ${error.message}`);
  }
}*/