import { useState, useEffect } from 'react';
import photoManifest from '../data/photo-manifest.json';

// Cache for discovered photos to avoid repeated discoveries
const photoCache: Record<string, string[]> = {};

// Simple utility function that gets photos from manifest
export const getPhotosFromDateFolder = (date: string): string[] => {
  const manifestPhotos = photoManifest[date as keyof typeof photoManifest] || [];
  return manifestPhotos.map(photo => `/pictures/${date}/${photo}`);
};

// Main hook that gets photos from manifest or uses existing photos
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

    // Get photos from manifest
    const manifestPhotos = getPhotosFromDateFolder(date);
    photoCache[date] = manifestPhotos;
    setPhotos(manifestPhotos);
  }, [date, existingPhotos]);

  if (existingPhotos && existingPhotos.length > 0) {
    return existingPhotos;
  }

  return photos;
};

// Helper function to validate if a photo path is valid
export const isValidPhotoPath = (photoPath: string): boolean => {
  return photoPath.startsWith('/pictures/') || photoPath.startsWith('http');
};

// Helper function to get all available dates with photos
export const getAvailablePhotoDates = (): string[] => {
  return Object.keys(photoManifest).sort();
};

// Helper function to get photo count for a specific date
export const getPhotoCountForDate = (date: string): number => {
  const manifestPhotos = photoManifest[date as keyof typeof photoManifest] || [];
  return manifestPhotos.length;
};

