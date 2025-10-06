#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the photo manifest
const manifestPath = path.join(__dirname, '../src/data/photo-manifest.json');
const dataPath = path.join(__dirname, '../src/data/data.ts');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

console.log('Available photos by date:');
console.log('========================');

// Show what photos are available for dates that have timeline entries
const timelineDates = [
  '2025-04-03', '2025-04-07', '2025-04-12', '2025-04-13', '2025-04-15',
  '2025-05-01', '2025-05-02', '2025-05-06', '2025-05-08', '2025-05-10',
  '2025-05-11', '2025-05-23', '2025-06-05', '2025-06-07', '2025-06-19',
  '2025-07-15', '2025-07-24', '2025-07-25', '2025-08-02', '2025-08-04',
  '2025-08-09', '2025-08-22', '2025-08-23', '2025-08-26'
];

timelineDates.forEach(date => {
  const photos = manifest[date];
  if (photos) {
    console.log(`${date}: ${photos.length} photos`);
    photos.forEach((photo, i) => {
      console.log(`  ${i + 1}. /pictures/${date}/${photo}`);
    });
  } else {
    console.log(`${date}: No photos available`);
  }
  console.log('');
});

console.log('Summary:');
console.log('========');
console.log(`Total dates with photos: ${Object.keys(manifest).length}`);
console.log(`Timeline dates checked: ${timelineDates.length}`);
console.log(`Timeline dates with photos: ${timelineDates.filter(date => manifest[date]).length}`);