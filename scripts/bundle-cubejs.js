import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const CUBEJS_DIR = path.join(__dirname, '../cubejs-master/lib');
const OUTPUT_FILE = path.join(__dirname, '../client/public/cubejs-bundle.js');

// Files to bundle in order
const FILES_TO_BUNDLE = [
  'async.js',
  'cube.js',
  'solve.js',
  'worker.js'
];

// Read and concatenate all files
let bundle = `// CubeJS Bundle - Generated on ${new Date().toISOString()}
// This file is auto-generated. Do not edit directly.

(function(global) {
  // Store the original module and exports objects
  const originalModule = typeof module !== 'undefined' ? module : {};
  const originalExports = typeof exports !== 'undefined' ? exports : {};
  
  // Create a local exports object
  const exports = {};
  
  // Bundle contents:
`;

// Add each file's content to the bundle
FILES_TO_BUNDLE.forEach(file => {
  const filePath = path.join(CUBEJS_DIR, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    bundle += `\n  // File: ${file}\n`;
    bundle += content;
    bundle += '\n';
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    process.exit(1);
  }
});

// Add the final part of the bundle
bundle += `
  // Expose Cube to the global scope
  global.Cube = exports.Cube || Cube;
  
  // Add solver initialization
  if (typeof Cube.initSolver === 'function') {
    console.log('Initializing CubeJS solver...');
    Cube.initSolver();
    Cube.solverInitialized = true;
  }
  
  // Restore original module and exports
  if (typeof module !== 'undefined') module = originalModule;
  if (typeof exports !== 'undefined') exports = originalExports;
  
  console.log('CubeJS library loaded successfully');
})(window);
`;

// Write the bundle to disk
try {
  fs.writeFileSync(OUTPUT_FILE, bundle);
  console.log(`Successfully created bundle at ${OUTPUT_FILE}`);
} catch (error) {
  console.error('Error writing bundle file:', error);
  process.exit(1);
}
