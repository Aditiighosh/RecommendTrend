import { mockPinterestData } from './mockPinterestData.js';

export async function getPinterestPins(boardSlug) {
  if (!boardSlug) throw new Error('boardSlug is required');

  

  const pins = mockPinterestData[boardSlug];
  if (!pins) throw new Error(`Board "${boardSlug}" not found`);

  return pins;
}

// Test the function
getPinterestPins('bohemian-daydream')
  .then(pins => console.log('Retrieved pins:', pins))
  .catch(error => console.error('Error:', error.message));