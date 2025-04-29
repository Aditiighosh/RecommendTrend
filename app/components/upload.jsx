// app/components/ImageUploader.jsx

'use client'; // Indicates this is a client-side React component

import { useState } from 'react'; // React hook for managing state
import { Button, Image } from '@nextui-org/react'; // UI components from the NextUI library
import axios from 'axios'; // HTTP client for making requests
/**
 * ImageUploader Component
 * - Allows users to upload an image, preview it, and send it to the backend.
 * - Handles file validation, preview generation, and error handling.
 */
export default function ImageUploader() {
  // State variables
  const [image, setImage] = useState(null); // Stores the selected image file
  const [preview, setPreview] = useState(''); // Stores the preview URL for the selected image
  const [error, setError] = useState(''); // Stores error messages
  const [uploadedFilename, setUploadedFilename] = useState(null); // Stores the uploaded file name
  /**
   * Handles file selection and validation.
   * - Validates the file type to ensure it's an image.
   * - Generates a preview URL for the selected image.
   * - Sends the file to the backend for processing.
   */

  const themes = [
    "Elegant minimalist outfit",
    "Petal pink",
    "Pastels",
    "Everyday",
    "indian-traditional",
    "Y2k",
    "bohemian-daydream",
  ];

  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG)'); // Show error if the file is not an image
      return;
    }

    // Generate a preview URL for the selected image
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result); // Set the preview once the file is read
    reader.readAsDataURL(file); // Read the file as a data URL

    setImage(file); // Store the selected image in state
    setError(''); // Clear any previous errors

    // Send the file to the backend
    try {
      const formData = new FormData(); // Create a FormData object to send the file
      formData.append('file', file); // Append the file to the FormData object

      const response = await fetch('/api/upload', {
        method: 'POST', // Use POST method to send the file
        body: formData, // Send the FormData object as the request body
      });

      if (!response.ok) {
        throw new Error('Failed to upload image'); // Throw an error if the response is not OK
      }

      const data = await response.json();// Parse the JSON response
      setUploadedFilename(data.filename); 
      console.log(uploadedFilename);
      console.log('File uploaded successfully:', data); // Log the file path returned by the backend
    } catch (error) {
      console.error('Error uploading file:', error); // Log the error to the console
      setError('Failed to upload image. Please try again.'); // Show an error message to the user
      setPreview(''); // Clear the preview on error
      setImage(null); // Clear the image state on error

      // Reset the error state after a short delay
      setTimeout(() => {
        setError(''); // Clear the error message after 3 seconds
      }, 3000);
    }
  };

  // Handle theme selection and send the selected theme to the backend
  const handleThemeSelect = async (theme) => {
    if (!uploadedFilename) {
      setError('Please upload an image first');
      return;
    }
  
    setError('');
    
    try {
      const boardSlug = theme.toLowerCase().replace(/\s+/g, '-');
      console.log('Sending:', { filename: uploadedFilename, boardSlug });
  
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: uploadedFilename,
          boardSlug,
        }),
      });
  
      // Handle non-JSON responses
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Request failed");
      }
  
      const result = await response.json();
      console.log("Recommendation result:", result);
  
      if (!result.success) {
        throw new Error(result.error || "Recommendation failed");
      }
  
      // Use result.data here
      console.log("Recommendations:", result.data);
  
    } catch (error) {
      console.error("Recommendation error:", error);
      setError(error.message || "Failed to get recommendations");
    }
  };

 return (
  <div className="flex flex-col items-center gap-6 p-6 bg-gray-50 rounded-lg shadow-lg w-full max-w-md">
    {/* Upload Section */}
    {!preview && (
      <div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 rounded-lg p-8 w-full">
        <input
          type="file"
          id="outfit-upload"
          accept="image/jpeg, image/png"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="outfit-upload" className="cursor-pointer">
          <Button
            color="primary"
            as="span"
            className="px-6 py-3 text-lg font-semibold border border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
          >
            Select Outfit Photo
          </Button>
        </label>
        <p className="text-sm text-gray-500">Only JPEG and PNG files are allowed.</p>
       </div>
      )}

      {/* Image Preview Section */}
      {preview && (
        <div className="relative flex flex-col items-center gap-4 bg-white rounded-lg shadow-md p-4 w-full">
          <Image
            src={preview}
            alt="Outfit preview"
            width={300}
            height={400}
            className="object-cover rounded-lg border border-gray-200"
          />
          <p className="text-sm text-gray-500">
            {image.name} ({Math.round(image.size / 1024)} KB)
          </p>
          <Button
            color="error"
            className="px-4 py-2 text-sm font-semibold border border-red-300 rounded-lg hover:bg-red-100 transition-all"
            onClick={() => {
              setPreview("");
              setImage(null);
              setUploadedFilename(null);
            }}
          >
            Remove Photo
          </Button>
        </div>
      )}

      {/* Theme Selection Section */}
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-lg font-semibold">Choose an Aesthetic:</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {themes.map((theme) => (
            <Button
              key={theme}
              onPress={() => handleThemeSelect(theme)}
              className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
            >
              {theme}
            </Button>
          ))}
        </div>
        </div>

{/* Error Message */}
{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
</div>
);
};

