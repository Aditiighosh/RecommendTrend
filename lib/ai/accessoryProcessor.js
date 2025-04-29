import vision from '@google-cloud/vision';
import sharp from 'sharp';

const visionClient = new vision.ImageAnnotatorClient();

// List of accessories you care about
const TARGET_ACCESSORIES = ['necklace','heels','purse','bag', 'shoes', 'watch', 'belt', 'hat', 'earrings', 'bracelet'];

export async function processAccessories(imageBuffer) {
  const [result] = await visionClient.annotateImage({
    image: { content: imageBuffer },
    features: [
      { type: 'OBJECT_LOCALIZATION' }
    ]
  });

  const objects = result.localizedObjectAnnotations || [];

  const foundAccessories = objects.filter(obj =>
    TARGET_ACCESSORIES.includes(obj.name.toLowerCase())
  );

  const results = {};

  for (const accessory of foundAccessories) {
    const name = accessory.name.toLowerCase();

    // Get bounding box and crop the region
    const croppedBuffer = await cropImage(imageBuffer, accessory.boundingPoly.normalizedVertices);

    // Extract features from cropped accessory
    const features = await extractFeatures(croppedBuffer);

    results[name] = {
      confidence: accessory.score,
      ...features
    };
  }

  return results;
}

async function cropImage(imageBuffer, vertices) {
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();

  const x1 = Math.min(...vertices.map(v => v.x)) * metadata.width;
  const y1 = Math.min(...vertices.map(v => v.y)) * metadata.height;
  const x2 = Math.max(...vertices.map(v => v.x)) * metadata.width;
  const y2 = Math.max(...vertices.map(v => v.y)) * metadata.height;

  const width = x2 - x1;
  const height = y2 - y1;

  return await image.extract({ left: Math.round(x1), top: Math.round(y1), width: Math.round(width), height: Math.round(height) }).toBuffer();
}

async function extractFeatures(imageBuffer) {
  const [result] = await visionClient.annotateImage({
    image: { content: imageBuffer },
    features: [
      { type: 'IMAGE_PROPERTIES' },
      { type: 'LABEL_DETECTION' },
      { type: 'WEB_DETECTION' }
    ]
  });

  // Dominant colors
  const colors = result.imagePropertiesAnnotation?.dominantColors?.colors || [];
  const colorVector = colors.flatMap(c => [
    (c.color.red || 0) / 255,
    (c.color.green || 0) / 255,
    (c.color.blue || 0) / 255
  ]);

  // Labels
  const labels = (result.labelAnnotations || []).slice(0, 5).map(l => l.description.toLowerCase());

  // Web Entities
  const webEntities = (result.webDetection?.webEntities || []).slice(0, 5).map(e => e.description?.toLowerCase() || '').filter(Boolean);

  return {
    colorVector,
    labels,
    webEntities
   
  };
}
