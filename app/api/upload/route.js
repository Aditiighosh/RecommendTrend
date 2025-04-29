// Import the `writeFile` function from the `fs/promises` module to handle file writing
import { writeFile } from 'fs/promises';
// Import `NextResponse` from Next.js to create API responses
import { NextResponse } from 'next/server';
import { analyzeOutfit } from '@/lib/ai/vision.js'; // Import the function to analyze the outfit in the image
/**
 * Handles POST requests to upload a file.
 * - Extracts the file from the request.
 * - Saves the file to the `public/uploads` directory.
 * - Returns the file path in the response.
 */
export async function POST(request) { 
  // Parse the form data from the request
  const data = await request.formData(); // `formData()` extracts key-value pairs from the request body
  const file = data.get('file'); // Retrieve the file from the form data using the key 'file'

  // Check if a file was provided
  if (!file) {
    // Return a 400 Bad Request response if no file is provided
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Convert the file to a buffer for writing to the file system
  const buffer = Buffer.from(await file.arrayBuffer()); // `arrayBuffer()` reads the file's binary data
  const filePath = `./public/uploads/${file.name}`; // Define the path where the file will be saved

  try {
    // Write the file to the specified path
    await writeFile(filePath, buffer); // `writeFile` writes the buffer to the file system
    const analysis = await analyzeOutfit(buffer); // Pass the buffer to the Vision API function
    // Return a 200 OK response with the file path if successful
    return NextResponse.json(
      {
        message: 'File uploaded and analyzed successfully',
        filePath: filePath,
        filename: file.name,
        analysis: {
          labels: analysis.labels,
          colors: analysis.colors,
          accessories: analysis.accessories
        }// Make sure this is a proper JSON-serializable object
      },
      { status: 200 }
    );
  } catch (error) {
    // Log any errors that occur during file writing
    console.error('Error saving file:', error);
    // Return a 500 Internal Server Error response if file writing fails
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
  }
}