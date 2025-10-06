#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the photo manifest
const manifestPath = path.join(__dirname, '../src/data/photo-manifest.json');
const dataPath = path.join(__dirname, '../src/data/data.ts');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let dataContent = fs.readFileSync(dataPath, 'utf8');

console.log('Fixing photo paths in data.ts...');

// Function to suggest best match from manifest
function findBestMatch(date, originalFilename) {
  const availablePhotos = manifest[date] || [];
  
  if (availablePhotos.length === 0) {
    console.log(`No photos found for date ${date}`);
    return null;
  }
  
  // If there's only one photo, use it
  if (availablePhotos.length === 1) {
    return availablePhotos[0];
  }
  
  // Try to match based on the original filename pattern
  const originalBase = originalFilename.replace(/\.(jpg|jpeg|JPG|JPEG)$/, '');
  
  // Look for similar names
  for (const photo of availablePhotos) {
    const photoBase = photo.replace(/\.(jpg|jpeg|JPG|JPEG)$/, '');
    if (photoBase.includes(originalBase.split('_').pop()) || originalBase.includes(photoBase.split('_').pop())) {
      return photo;
    }
  }
  
  // If no match found, return the first photo
  console.log(`No exact match found for ${originalFilename} on ${date}, using ${availablePhotos[0]}`);
  return availablePhotos[0];
}

// Find all photo references in the file
const photoRegex = /\/pictures\/(\d{4}-\d{2}-\d{2})\/([^"]+)/g;
let match;
const replacements = [];

while ((match = photoRegex.exec(dataContent)) !== null) {
  const [fullMatch, date, filename] = match;
  const suggestedPhoto = findBestMatch(date, filename);
  
  if (suggestedPhoto && suggestedPhoto !== filename) {
    replacements.push({
      original: fullMatch,
      replacement: `/pictures/${date}/${suggestedPhoto}`,
      date,
      originalFile: filename,
      newFile: suggestedPhoto
    });
  }
}

// Apply replacements
let changesCount = 0;
for (const replacement of replacements) {
  if (dataContent.includes(replacement.original)) {
    dataContent = dataContent.replace(replacement.original, replacement.replacement);
    console.log(`Fixed: ${replacement.date}/${replacement.originalFile} → ${replacement.newFile}`);
    changesCount++;
  }
}

// Write back the file
fs.writeFileSync(dataPath, dataContent);

console.log(`\nFixed ${changesCount} photo path mismatches`);
console.log('Photo paths have been corrected!');