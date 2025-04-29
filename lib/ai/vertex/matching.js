// lib/pinecone.js
import { Pinecone } from '@pinecone-database/pinecone';
//import { FetchAPI } from '@pinecone-database/pinecone';  
//import { generateImageVector } from '../vision.js';
import fetch from 'node-fetch';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import {exec} from 'child_process';
import { generateImageVector } from '../vision.js';


dotenv.config();

const customFetch = async (input, init) => {
  console.log('Custom fetch called with:', input);
  try {
    const response = await fetch(input, init);
    if (!response.ok) {
      console.error(`Fetch failed with status ${response.status}: ${response.statusText}`);
    }
    return response;
  } catch (error) {
    console.error('Error in custom fetch:', error.message);
    throw error;
  }
};

console.log('Pinecone API Key:', process.env.PINECONE_API_KEY ? 'Loaded' : 'Missing');

let pineconeClient;

async function initPinecone() {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
//      environment: 'your-environment', // Replace with your Pinecone environment
      fetchApi: customFetch, // Use the correct property name for custom fetch
    });
  }
  return pineconeClient;
}

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

async function getnewVectorIds(index, pinIds, boardSlug) {
  return new Promise((resolve, reject) => {
    // Path to the Python script
    const pythonScriptPath = 'C:\\Users\\Vishwajeet Ghosh\\Desktop\\rt\\lib\\ai\\vertex\\pinecone_integration.py';

    // Execute the Python script with boardSlug as an argument
    exec(`python "${pythonScriptPath}" "${boardSlug}"`, (error, stdout, stderr) => {
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
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (parseError) {
        console.error('Error parsing Python script output:', parseError.message);
        reject(parseError);
      }
    });
  });
}

async function updateIndexWithPins(index, pins, boardSlug) {
  const BATCH_SIZE = pins.length; // Process all pins in one batch;
  const successfulUploads = [];
  const failedPins = [];

  // Get new IDs
  let newPins;
  try {
    newPins = await getnewVectorIds(index, pins.map((p) => p.id), boardSlug);
    console.log(`hey im in updateIndexWithPins and the Existing IDs received in this function is: ${newPins.length}`);
    console.log(`The pin ids are: ${newPins}`);
  } catch (error) {
    console.error('Error fetching new vector IDs:', error.message);
    return { successfulUploads, failedPins };
  }



  try {
    const vectors = await Promise.all(
      newPins.map(async (pin) => {
        try {
          console.log(`Processing pin ID: ${pin}`);

          // Map pin ID to image URL
          const matchedPin = pins.find((p) => p.id === pin);
          console.log(`Matched pin ID: ${matchedPin ? matchedPin.id : 'Not found'}`);
          if (!matchedPin || !matchedPin.imageUrl) {
            console.error(`Image URL not found for pin ID ${pin}`);
            failedPins.push(pin);
            return null;
          }
          

          // Fetch the image
          let response;
          try {
            response = await axios.get(matchedPin.imageUrl, {
              responseType: 'arraybuffer',
              timeout: 10000,
            });
          } catch (fetchError) {
            console.error(`Failed to fetch image for pin ID ${pin}:`, fetchError.message);
            failedPins.push(pin);
            return null;
          }

          const imageBuffer = Buffer.from(response.data);
          console.log(`checking directory exists`);
          // Ensure the directory exists
          const tempDir = path.join(process.cwd(), 'lib', 'ai', 'vertex', 'pins');
          if (!fs.existsSync(tempDir)) {
            console.log(`Creating directory: ${tempDir}`);
            fs.mkdirSync(tempDir, { recursive: true });
          }
          console.log(`saving image to ${tempDir}`);
          // Save the image buffer to a temporary file
          const tempFilePath = path.join(tempDir, `temp_image_${pin}.jpg`);
          fs.writeFileSync(tempFilePath, imageBuffer);
          console.log(`Saved image to ${tempFilePath}`);


          // Generate the vector using the Python script
          let vector;
          try {
            vector = await generateImageVectorWithPython(imageBuffer);
            console.log(`Generated vector for pin ID ${pin}, length: ${vector.length}`);
          } catch (vectorError) {
            console.error(`Failed to generate vector for pin ID ${pin}:`, vectorError.message);
            failedPins.push(pin);
            return null;
          }

          // Clean up the temporary file
          try {
            fs.unlinkSync(tempFilePath);
            console.log(`Deleted temporary file: ${tempFilePath}`);
          } catch (unlinkError) {
            console.error(`Failed to delete temporary file ${tempFilePath}:`, unlinkError.message);
          }

          return {
            id: pin,
            values: vector,
            metadata: {
              description: matchedPin.description || 'No description provided',
              link: matchedPin.link || 'No link provided',
              imageUrl: matchedPin.imageUrl,
              updatedAt: new Date().toISOString(),
            },
          };
        } catch (pinError) {
          console.error(`Failed to process pin ${pin}:`, pinError.message);
          failedPins.push(pin);
          return null;
        }
      })
    );

    const validVectors = vectors.filter((v) => v !== null);

    if (validVectors.length > 0) {
      try {
        const upsertResponse = await index.upsert(validVectors);
        console.log(`Upserted ${validVectors.length} vectors successfully.`, upsertResponse);
        successfulUploads.push(...validVectors.map((v) => v.id));
      } catch (upsertError) {
        console.error(`Failed to upsert vectors:`, upsertError.message);
      }
    } else {
      console.log(`No valid vectors to upsert`);
    }
  } catch (error) {
    console.error(`Error during vector generation:`, error.message);
  }

  console.log(`Update results:
    - Total pins: ${pins.length}
    - New pins processed: ${successfulUploads.length}
    - Failed pins: ${failedPins.length}`);

  return { successfulUploads, failedPins };
}

export async function getBoardIndex(boardSlug, pins = []) {
  //boardSlug = `fashion-${boardSlug}`;
  const pc = await initPinecone();
  const indexName = boardSlug.toLowerCase();
  
  try {
    // Check index existence
    const existingIndexes = (await pc.listIndexes()).indexes || [];
    const indexExists = existingIndexes.some(index => index.name === indexName);
    console.log(`Fetching index '${indexName}'`);
    // Create index if needed
    if (!indexExists) {
      console.log(`Creating new index '${indexName}'`);
      
      await pc.createIndex({
        name: indexName,
        dimension: 512,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
    }

    // Get index reference
    const index = pc.index(indexName);
    
    // Wait for index to be ready (with timeout)
    const MAX_ATTEMPTS = 10;
    let attempts = 0;
    while (attempts < MAX_ATTEMPTS) {
      try {
        const stats = await index.describeIndexStats();
        console.log(`Index ready. Current vector count: ${stats.total_Vector_Count}`);
        break;
      } catch (error) {
        attempts++;
        if (attempts >= MAX_ATTEMPTS) {
          throw new Error(`Index not ready after ${MAX_ATTEMPTS} attempts`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Process new pins if provided
    if (pins.length > 0) {
      console.log(`Processing ${pins.length} pins`);
      await updateIndexWithPins(index, pins, boardSlug);
    } else {
      console.log('No pins provided for update');
    }

    return index;
  } catch (error) {
    console.error(`Pinecone error for ${indexName}:`, error);
    throw new Error('Failed to initialize Pinecone index');
  }
}
