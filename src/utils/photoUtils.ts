import { useState, useEffect } from 'react';

// Cache for discovered photos to avoid repeated discoveries
const photoCache: Record<string, string[]> = {};

// Simple utility function - just returns empty array since we do everything in the hook
export const getPhotosFromDateFolder = (date: string): string[] => {
  return [];
};

// Main hook that discovers photos by trying sequential image indices
export const usePhotosFromDate = (date: string, existingPhotos?: string[]): string[] => {
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    // If we have existing photos from timeline data, use those
    if (existingPhotos && existingPhotos.length > 0) {
      setPhotos(existingPhotos);
      return;
    }

    // Check cache first
    if (photoCache[date]) {
      setPhotos(photoCache[date]);
      return;
    }

    // Discover all photos in the date folder
    const discoverPhotos = async () => {
      const discoveredPhotos = await findAllPhotosInFolder(date);
      photoCache[date] = discoveredPhotos;
      setPhotos(discoveredPhotos);
    };

    discoverPhotos();
  }, [date, existingPhotos]);

  if (existingPhotos && existingPhotos.length > 0) {
    return existingPhotos;
  }

  return photos;
};

// Much simpler approach: just try numbered photos until we can't find any more
const findAllPhotosInFolder = async (date: string): Promise<string[]> => {
  const photos: string[] = [];
  
  // Try pattern: 2025-04-08_photo-1.jpg, 2025-04-08_photo-2.jpg, etc.
  let index = 1;
  let consecutiveMisses = 0;
  const maxConsecutiveMisses = 5; // Stop after 5 consecutive misses
  
  while (consecutiveMisses < maxConsecutiveMisses && index < 50) {
    const extensions = ['jpg', 'jpeg', 'JPG'];
    let found = false;
    
    for (const ext of extensions) {
      const photoPath = `/pictures/${date}/${date}_photo-${index}.${ext}`;
      if (await imageExists(photoPath)) {
        photos.push(photoPath);
        found = true;
        consecutiveMisses = 0;
        break;
      }
    }
    
    if (!found) {
      consecutiveMisses++;
    }
    
    index++;
  }
  
  return photos;
};

// Helper function to test if an image exists
const imageExists = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
    
    // Timeout to prevent hanging
    setTimeout(() => resolve(false), 2000);
  });
};

