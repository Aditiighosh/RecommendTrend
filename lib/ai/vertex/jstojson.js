import { mockPinterestData } from "../../pinterest/mockPinterestData.js";
import fs from 'fs';
import path from 'path';
import { mkdirSync } from 'fs';

//convert the mockPinterestData to JSON format
const jsonData = JSON.stringify(mockPinterestData, null, 2);
//create the directory if it doesn't exist

const dirPath = path.join(process.cwd(), 'lib', 'pinterest');
if (!fs.existsSync(dirPath)) {
  mkdirSync(dirPath, { recursive: true });
}

// Define the output file path
const outputFilePath = path.join(process.cwd(), 'lib', 'pinterest', 'mockPinterestData.json');
// Write the JSON data to the file
fs.writeFileSync(outputFilePath, jsonData, 'utf8');
console.log(`Mock Pinterest data has been saved to ${outputFilePath}`);
