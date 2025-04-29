// Import necessary modules and components
import  ImageUploader  from "./components/upload"; // Import the upload component
import { Button } from "./components/ui/button"; // Import the button component
import "./globals.css"; // Import global styles
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Image Upload Example</h1>
      <div className="mt-10">
        <ImageUploader /> {/* Image upload component */} 
      </div>
      <Button variant={'destructive'}>shadcn button </Button> 
    </main>
  );
}
