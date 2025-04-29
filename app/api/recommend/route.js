import { generateImageVector } from "../../../lib/ai/vision.js";
import { getPinterestPins } from "../../../lib/pinterest/pinterest.js";
import { getBoardIndex } from "../../../lib/ai/vertex/matching.js";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process"; // Add this line
import { processAccessories} from "../../../lib/ai/accessoryProcessor.js";
import axios from "axios";
import  {searchAmazonProducts}  from "../../../lib/amazon/amazonApi.js";

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the JSON body
    const { filename, boardSlug } = body;

    if (!filename || !boardSlug) {
      return new Response(JSON.stringify({ error: "Missing filename or boardSlug in the request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Received POST request:", { filename, boardSlug });

    // Construct the temporary file path
    const tempFilePath = path.join(process.cwd(), "public/uploads", filename);

    //convert the file to a buffer for writing to the file system
    const buffer = Buffer.from(await fs.readFile(tempFilePath)); // `arrayBuffer()` reads the file's binary data

    // Generate the vector for the uploaded image
    const uservector = await generateImageVectorWithPython(tempFilePath);
    console.log("Generated user vector:", uservector);

    // Retrieve pins from the specified board
    const pins = await getPinterestPins(boardSlug);
    console.log("Retrieved pins:", pins.slice(0, 3));

    // Get the corresponding Pinecone index for the boardSlug
    const index = await getBoardIndex(boardSlug, pins);
    const stats = await index.describeIndexStats();
    console.log("Index stats:", stats);

    // Query the index for similar pins
    const queryResponse = await index.query({
      vector: uservector,
      topK: 5,
      includeMetadata: true,
      includeValues: false,
    });

    console.log("Query response:", queryResponse);

    // Process the query response to extract metadata
    if (!queryResponse || !queryResponse.matches || queryResponse.matches.length === 0) {
      return new Response(JSON.stringify({ error: "No similar pins found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const similarPins = queryResponse.matches.map((match) => ({
      pinId: match.id,
      score: match.score,
      imageUrl: match.metadata.imageUrl,
      description: match.metadata.description || "No description provided",
    }));

    console.log("Similar pins:", similarPins);

    //now we need to process accessories from these pins

    const imageBuffers = await Promise.all(
      similarPins.map(async (pin) => {
        // Find the original pin from the pins array
        const originalPin = pins.find((p) => p.id === pin.pinId);

        if (!originalPin) {
          console.warn(`Original pin not found for pinId: ${pin.pinId}`);
          return null; // Skip if the original pin is not found
        }

        try {
          // Fetch the image buffer
          const response = await axios.get(originalPin.imageUrl, { responseType: "arraybuffer" });
          console.log("pins", pins);
          // Return the enriched pin data along with the image buffer
          return{
            pinId: pin.pinId,
            score: pin.score,
            imageUrl: originalPin.imageUrl,
            description: originalPin.description || "No description provided",
            link: originalPin.link || "No link available",
            buffer: Buffer.from(response.data), // Include the image buffer
          };


          console.log("pins", pins);

        } catch (error) {
          console.error(`Failed to fetch image for pinId: ${pin.pinId}`, error.message);
          return null; // Skip this pin if the image fetch fails
        }
      })
    );

    // Filter out any failed image fetches
   const validImageBuffers = imageBuffers.filter((item) => item !== null);

    console.log("Valid image buffers with metadata created");

    // Process the accessories using the valid image buffers one by one 
    const processedAccessories = await Promise.all(
        validImageBuffers.map(async (item) => {
            try {
            const { pinId, score, imageUrl, description, link, buffer } = item;
            console.log("Processing accessories for pinId:", pinId);
            const accessories = await processAccessories(buffer); // Process the image buffer
            return {
                accessories
            };
            } catch (error) {
            console.error(`Error processing accessories for pinId: ${item.pinId}`, error.message);
            return null; // Skip this item if processing fails
            }
        })
        );

    // Filter out any empty or null accessories
    const filteredAccessories = processedAccessories.filter(
      (item) => item && Object.keys(item.accessories).length > 0
    );

    console.log("Filtered accessories:", filteredAccessories, null, 2);

    // Now, we can search for Amazon products based on the accessories
    const amazonResults = await Promise.all(
      filteredAccessories.map(async (item) => {
        const { accessories } = item;
        console.log("Searching Amazon for accessories:", accessories);
        const searchResults = await searchAmazonProducts({
          colorVector: uservector,
          labels: Object.keys(accessories),
          webEntities: [], // Add any other relevant data here
        });
        return searchResults.products; // Return the products found for this accessory
      })
    );
    
    console.log("Amazon search results:", amazonResults, null, 2);
    // Return the similar pins and filtered accessories as the response
    return new Response(JSON.stringify({ similarPins, filteredAccessories,amazonResults }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
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