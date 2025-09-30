#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Script to generate a manifest of all photos in the pictures directory
// This runs at build time to create a simple mapping

const picturesDir = path.join(__dirname, '../public/pictures');
const outputFile = path.join(__dirname, '../src/data/photo-manifest.json');

function generatePhotoManifest() {
  const manifest = {};
  
  if (!fs.existsSync(picturesDir)) {
    console.log('Pictures directory not found');
    return;
  }
  
  // Get all date directories
  const dateDirs = fs.readdirSync(picturesDir)
    .filter(dir => {
      const fullPath = path.join(picturesDir, dir);
      return fs.statSync(fullPath).isDirectory() && dir.match(/^\d{4}-\d{2}-\d{2}$/);
    });
  
  // For each date directory, get all image files
  dateDirs.forEach(dateDir => {
    const datePath = path.join(picturesDir, dateDir);
    const files = fs.readdirSync(datePath)
      .filter(file => file.match(/\.(jpg|jpeg|JPG)$/i))
      .sort();
    
    if (files.length > 0) {
      manifest[dateDir] = files;
    }
  });
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write the manifest file
  fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));
  
  console.log(`Generated photo manifest with ${Object.keys(manifest).length} dates`);
  console.log(`Total photos: ${Object.values(manifest).reduce((sum, photos) => sum + photos.length, 0)}`);
}

generatePhotoManifest();