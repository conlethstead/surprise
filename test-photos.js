// Simple test to verify photo paths are working
import { getPhotosFromDateFolder, getPhotoCountForDate, getAvailablePhotoDates } from '../src/utils/photoUtils';

console.log('Testing photo utility functions...');

// Test getting photos for specific dates
console.log('\n1. Testing Leila dinner date (2025-04-07):');
const leilaPhotos = getPhotosFromDateFolder('2025-04-07');
console.log('Photos found:', leilaPhotos);

console.log('\n2. Testing date with multiple photos (2025-04-12):');
const multiplePhotos = getPhotosFromDateFolder('2025-04-12');
console.log('Photos found:', multiplePhotos);

console.log('\n3. Testing photo count function:');
console.log('2025-04-07 photo count:', getPhotoCountForDate('2025-04-07'));
console.log('2025-04-12 photo count:', getPhotoCountForDate('2025-04-12'));

console.log('\n4. Testing available dates:');
const dates = getAvailablePhotoDates();
console.log('First 10 available dates:', dates.slice(0, 10));
console.log('Total dates with photos:', dates.length);

console.log('\n5. Testing non-existent date:');
const noPhotos = getPhotosFromDateFolder('2025-01-01');
console.log('Photos for non-existent date:', noPhotos);

console.log('\nPhoto utility tests completed!');