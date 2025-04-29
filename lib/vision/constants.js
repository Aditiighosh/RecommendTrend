import { collectAllLabels } from '../ai/fashionDictionary.js';
import fs from 'fs';
import path from 'path';

(async () => {
  const labels = await collectAllLabels();

  // Define the output file path
  const outputFilePath = path.join(process.cwd(), 'lib', 'vision', 
    'labels.js');

  // Format the labels as a JavaScript array and write to the file
  const fileContent = `export const labels = ${JSON.stringify(labels, null, 2)};`;

  fs.writeFileSync(outputFilePath, fileContent, 'utf8');
  console.log(`Labels have been saved to ${outputFilePath}`);
});

