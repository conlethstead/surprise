#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the photo manifest and data file
const manifestPath = path.join(__dirname, '../src/data/photo-manifest.json');
const dataPath = path.join(__dirname, '../src/data/data.ts');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let dataContent = fs.readFileSync(dataPath, 'utf8');

console.log('Updating photo references in data.ts to match available photos...');

// Function to get correct photos for a date
function getCorrectPhotosForDate(date) {
  const availablePhotos = manifest[date] || [];
  return availablePhotos.map(photo => `/pictures/${date}/${photo}`);
}

// Parse the data.ts file to find timeline entries
const entryRegex = /{[^}]*"date":\s*"([^"]+)"[^}]*}/gs;
const photoSectionRegex = /photos:\s*\[([\s\S]*?)\]/g;

// Create a map of dates to entries for easier processing
const dateToEntry = {};
let match;

// First pass: identify all dates that have timeline entries
while ((match = entryRegex.exec(dataContent)) !== null) {
  const fullEntry = match[0];
  const dateMatch = fullEntry.match(/"date":\s*"([^"]+)"/);
  if (dateMatch) {
    const date = dateMatch[1];
    dateToEntry[date] = fullEntry;
  }
}

console.log(`Found ${Object.keys(dateToEntry).length} timeline entries`);

let updatesCount = 0;

// Process each entry that has photos
Object.keys(dateToEntry).forEach(date => {
  const correctPhotos = getCorrectPhotosForDate(date);
  
  if (correctPhotos.length === 0) {
    console.log(`No photos available for ${date}`);
    return;
  }

  // Find the photos section for this entry
  const entryStart = dataContent.indexOf(dateToEntry[date]);
  const entryEnd = dataContent.indexOf('},', entryStart) + 2;
  const entryContent = dataContent.substring(entryStart, entryEnd);
  
  const photoMatch = entryContent.match(/photos:\s*\[([\s\S]*?)\]/);
  
  if (photoMatch) {
    // Entry already has photos - update them
    const oldPhotosSection = photoMatch[0];
    const formattedPhotos = correctPhotos.map(photo => `        "${photo}"`).join(',\n');
    const newPhotosSection = `photos: [\n${formattedPhotos}\n      ]`;
    
    const updatedEntryContent = entryContent.replace(oldPhotosSection, newPhotosSection);
    dataContent = dataContent.replace(entryContent, updatedEntryContent);
    
    console.log(`Updated ${date}: ${correctPhotos.length} photos`);
    updatesCount++;
  } else {
    // Entry doesn't have photos - add them if there's a memory/description section
    const memoryMatch = entryContent.match(/memories:\s*\[([\s\S]*?)\]/);
    const jokesMatch = entryContent.match(/jokes:\s*\[([\s\S]*?)\]/);
    const moviesMatch = entryContent.match(/movies:\s*\[([\s\S]*?)\]/);
    
    // Find the last section before the closing brace
    let insertPoint = entryContent.lastIndexOf('\n    }');
    
    if (insertPoint === -1) {
      insertPoint = entryContent.lastIndexOf('}') - 1;
    }
    
    const formattedPhotos = correctPhotos.map(photo => `        "${photo}"`).join(',\n');
    const photosSection = `,\n      photos: [\n${formattedPhotos}\n      ]`;
    
    const beforeInsert = entryContent.substring(0, insertPoint);
    const afterInsert = entryContent.substring(insertPoint);
    const updatedEntryContent = beforeInsert + photosSection + afterInsert;
    
    dataContent = dataContent.replace(entryContent, updatedEntryContent);
    
    console.log(`Added photos to ${date}: ${correctPhotos.length} photos`);
    updatesCount++;
  }
});

// Write the updated content back to the file
fs.writeFileSync(dataPath, dataContent);

console.log(`\nUpdated ${updatesCount} entries with correct photo references`);
console.log('Photo references have been synchronized with available photos!');