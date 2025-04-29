import { generateImageVector } from "./lib/ai/vision.js";
import { getPinterestPins } from "./lib/pinterest/pinterest.js";
import { processAccessories } from "./lib/ai/accessoryProcessor.js";
import { analyzeOutfit } from "./lib/ai/vision.js";
import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";
//import { findSimilarPins } from "./lib/ai/vertex/matching.js";
import { getBoardIndex } from './lib/ai/vertex/matching.js ';
import {exec} from 'child_process';
import { fileURLToPath } from 'url';
import fsp from 'fs/promises'; 


async function testGetPinterestPins() {
  try {
    const boardSlug = "bohemian-daydream";
    console.log("Testing getPinterestPins with boardSlug:", boardSlug);

    const pins = await getPinterestPins(boardSlug);
    console.log("Retrieved pins:", pins);

    return pins; // Return the pins for further use
  } catch (error) {
    console.error("Error testing getPinterestPins:", error);
    return []; // Return an empty array in case of an error
  }
}

async function testProcessAccessories() {
  try {
    // Retrieve pins
    const pins = await testGetPinterestPins();

    // Process each pin's image
    for (const pin of pins) {
      console.log(`Processing image from URL: ${pin.imageUrl}`);

      // Fetch the image from the URL
      const response = await fetch(pin.imageUrl);
      if (!response.ok) {
        console.error(`Failed to fetch image from ${pin.imageUrl}: ${response.statusText}`);
        continue;
      }

      const imageBuffer = await response.buffer();
      console.log("Image buffer loaded successfully");

      // Process the accessories in the image
      const accessories = await processAccessories(imageBuffer);
      console.log(`Detected accessories for ${pin.imageUrl}:`, accessories);
    }
  } catch (error) {
    console.error("Error testing processAccessories:", error);
  }
}



async function testFindSimilarPins() {
  try {
    console.log('Testing findSimilarPins function...');

    // Read the user-uploaded image as a buffer
    const userImageBuffer = await fs.readFile('./public/uploads/testimage7.jpg');
    //save this buffer to a file
    
    const tempFilePath = path.join(process.cwd(), 'public/uploads/buffers', 'temp-image1.jpg');
    await fsp.writeFile(tempFilePath, userImageBuffer);
    console.log('User image buffer loaded successfully');
    const analysis = await analyzeOutfit(userImageBuffer); // Pass the buffer to the Vision API function
    console.log('Analysis result:', analysis); // Log the analysis result
    const uservector = await generateImageVectorWithPython(tempFilePath);
    console.log('Generated user vector:', uservector);

    // Retrieve pins from the specified board
    const boardSlug = 'indian-traditional';
    const pins = await getPinterestPins(boardSlug);
    

   // console.log('Retrieved pins:', pins.slice(0, 3));

   // Limit to the first 3 pins for testing
    // Get the corresponding index for the boardSlug

    const index = await getBoardIndex(boardSlug,  pins);
    const stats = await index.describeIndexStats();
    console.log('Index stats:', stats); // Check the index stats

    let queryResponse;
    try {
      // Query the index for similar pins to the user image vector
      queryResponse = await index.query({
        vector: uservector,
        topK: 2, // Number of similar pins to retrieve
        includeMetadata: true,
        includeValues: false,
      });
      console.log('Query response:', queryResponse); // Check the query response
    } catch (error) {
      console.error('Error querying index:', error);
    }

    let similarPins;
    try {
      // Process the query response to extract metadata
      similarPins = queryResponse.matches.map((match) => {
        const pinId = match.id; // ID of the pin
        const score = match.score; // Similarity score
        const imageUrl = match.metadata.imageUrl; // Image URL of the pin
        const description = match.metadata.description; // Description of the pin
        return { pinId, score, imageUrl, description };
      });
      console.log(
        'Similar pins:',
        similarPins.map((pin) => ({
          pinId: pin.pinId,
          score: pin.score,
          imageUrl: pin.imageUrl,
          description: pin.description,
        }))
      );
    } catch (error) {
      console.error('Error processing variable similarPins:', error);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testFindSimilarPins();

async function generateImageVectorWithPython(tempFilePath) {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = 'C:\\Users\\Vishwajeet Ghosh\\Desktop\\rt\\lib\\ai\\clip.py';

    // Execute the Python script with the temporary file path as an argument
    exec(`python "${pythonScriptPath}" "${tempFilePath}"`, (error, stdout, stderr) => {
      // Clean up the temporary file
      

      if (error) {
        console.error('Error executing Python script:', error.message);
        reject(error);
        return;
      }
      if (stderr) {
        console.error('Python script error:', stderr);
        reject(new Error(stderr));
        return;
      }

      try {
        // Parse the JSON output from the Python script
        const vector = JSON.parse(stdout);
        resolve(vector);
      } catch (parseError) {
        console.error('Error parsing Python script output:', parseError.message);
        reject(parseError);
      }
    });
  });
}

async function testGenerateImageVector() {
  try {
    const imageBuffer = await fs.readFile('./public/uploads/test-outfit.jpeg');
    const vector = await generateImageVector(imageBuffer);
    console.log('Generated vector:', vector);
  } catch (error) {
    console.error('Error testing generateImageVector:', error.message);
  }
}

//testGenerateImageVector();

