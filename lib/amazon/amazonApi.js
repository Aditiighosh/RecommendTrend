import { mockProducts } from './mockData.js';
import namer from 'color-namer';

function getColorName(colorVector) {
  // Convert [0-1] vector to [0-255] vector
  const [r, g, b] = colorVector.map((c) => Math.round(c * 255));

  // Convert to hex
  const hex = `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  // Get color name
  const { pantone } = namer(hex);
  return pantone[0]?.name || 'Unknown Color';
}

const vectorToSearchParams = (colorVector, labels = [], webEntities = []) => {
  const color = getColorName(colorVector);

  // Combine all terms, removing duplicates and empty strings
  const keywords = [
    ...new Set([
      ...labels.filter(Boolean),
      ...webEntities.filter(Boolean),
      color.replace(/\s+/g, ' ').trim()
    ])
  ].join(' ');

  return { keywords, color };
};

export const searchAmazonProducts = async ({
  colorVector,
  labels = [],
  webEntities = [],
}) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const { keywords, color } = vectorToSearchParams(
      colorVector,
      labels,
      webEntities
    );
    console.log(`Searching Amazon for: ${keywords} with color: ${color}`);

    // Split keywords into terms and lowercase them
    const searchTerms = keywords.toLowerCase().split(/\s+/);

    // Filter mock products
    const results = mockProducts.products.filter((product) => {
      const searchText = `${product.title} ${product.description} ${product.color}`.toLowerCase();

      // Check if any search term exists in product text
      const keywordMatch = searchTerms.some((term) =>
        searchText.includes(term)
      );

      // More flexible color matching
      const colorMatch =
        color === "multi" ||
        color.toLowerCase().includes(product.color.toLowerCase()) ||
        product.color.toLowerCase().includes(color.toLowerCase());

      return keywordMatch && colorMatch;
    });

    return {
      success: true,
      searchQuery: { keywords, color },
      products: results.length > 0 ? results.slice(0, 10) : mockProducts.products.slice(0, 3),
    };
  } catch (error) {
    console.error("Error searching Amazon products:", error);
    return {
      success: false,
      error: "Error searching Amazon products",
      products: mockProducts.products.slice(0, 3), // Still return some products
    };
  }
};