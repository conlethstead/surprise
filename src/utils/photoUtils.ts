// Utility function to get all photos from a date-based folder
// This will be used to dynamically load photos based on the timeline entry date

export const getPhotosFromDateFolder = (date: string): string[] => {
  // In a real app, this would dynamically read from the filesystem
  // For now, we'll create a mapping of known photo folders
  
  const photoFolders: Record<string, string[]> = {
    '2025-03-21': ['2025-03-21_night2.jpeg'],
    '2025-03-30': ['2025-03-30_movie1.jpeg'],
    '2025-04-01': ['2025-04-01_party3.JPG', '2025-04-01_party4.JPG'],
    '2025-04-03': ['2025-04-03_legs.jpeg'],
    '2025-04-04': ['2025-04-04_opener1.jpeg'],
    '2025-04-05': ['2025-04-05_opener1.JPG'],
    '2025-04-07': ['2025-04-07_skims2.jpeg'],
    '2025-04-08': ['2025-04-08_leila1.jpeg'],
    '2025-04-10': ['2025-04-10_work1.jpeg'],
    '2025-04-12': ['2025-04-12_beacon1.jpeg', '2025-04-12_shak2.JPG'],
    '2025-04-13': ['2025-04-13_eatori1.jpeg', '2025-04-13_eatori3.JPG', '2025-04-13_pure1.jpeg'],
    '2025-04-15': ['2025-04-15_soccer2.jpeg'],
    '2025-04-16': ['2025-04-16_gf1.jpeg', '2025-04-16_gf2.jpeg', '2025-04-16_gf3.jpeg'],
    '2025-04-18': ['2025-04-18_tongue.jpeg'],
    '2025-04-23': ['2025-04-23_tigers1.jpeg', '2025-04-23_tigers2.jpeg'],
    '2025-04-28': ['2025-04-28_shak1.JPG'],
    '2025-05-01': ['2025-05-01_windfrey1.JPG', '2025-05-01_windfrey1.jpeg'],
    '2025-05-02': ['2025-05-02_party1.JPG', '2025-05-02_party2.JPG'],
    '2025-05-06': ['2025-05-06_herbday1.JPG', '2025-05-06_herbday4.jpeg'],
    '2025-05-07': ['2025-05-07_herbday5.jpeg'],
    '2025-05-08': ['2025-05-08_fashion1.JPG', '2025-05-08_fashion2.JPG'],
    '2025-05-09': ['2025-05-09_fashion1.jpeg'],
    '2025-05-10': ['2025-05-10_farmers1.jpeg', '2025-05-10_farmers2.JPG', '2025-05-10_farmers3.JPG', '2025-05-10_chop1.JPG', '2025-05-10_walk1.jpeg'],
    '2025-05-11': ['2025-05-11_tennis1.JPG', '2025-05-11_tennis1.jpeg', '2025-05-11_tennis2.jpeg', '2025-05-11_sleepy2.jpeg'],
    '2025-05-13': ['2025-05-13_chillin1.jpeg'],
    '2025-05-16': ['2025-05-16_stim.jpeg'],
    '2025-05-23': ['2025-05-23_town1.JPG', '2025-05-23_town2.JPG'],
    '2025-05-27': ['2025-05-27_homebday1.jpeg'],
    '2025-06-05': [
      '2025-06-05_bday1.JPG', '2025-06-05_bday2.JPG', '2025-06-05_bday3.JPG', 
      '2025-06-05_bday4.JPG', '2025-06-05_bday5.JPG', '2025-06-05_highlands1.jpeg',
      '2025-06-05_highlands2.jpeg', '2025-06-05_highlands3.jpeg', '2025-06-05_highlands5.jpeg',
      '2025-06-05_highlands6.jpeg', '2025-06-05_mybday1.jpeg', '2025-06-05_tongue2.jpeg'
    ],
    '2025-06-06': ['2025-06-06_highlands1.jpg', '2025-06-06_highlands4.jpeg'],
    '2025-06-07': ['2025-06-07_boat1.jpeg', '2025-06-07_boat2.jpeg', '2025-06-07_boat3.jpeg', '2025-06-07_boat4.jpeg', '2025-06-07_boat2.JPG'],
    '2025-06-08': ['2025-06-08_dance1.jpeg', '2025-06-08_dance2.jpeg', '2025-06-08_dance3.jpeg', '2025-06-08_dance4.jpeg', '2025-06-08_dance5.jpeg', '2025-06-08_dance6.jpeg'],
    '2025-06-17': ['2025-06-17_sleepy1.jpeg', '2025-06-17_herbday1.jpeg'],
    '2025-06-18': ['2025-06-18_supreme1.JPG', '2025-06-18_supreme2.JPG', '2025-06-18_supreme3.JPG', '2025-06-18_supreme4.JPG'],
    '2025-06-19': ['2025-06-19_shelf.jpeg', '2025-06-19_sexy.jpeg'],
    '2025-06-20': ['2025-06-20_toes.jpeg'],
    // Add more dates as needed...
  };

  const photos = photoFolders[date] || [];
  
  // Convert to full paths
  return photos.map(photo => `/src/data/pictures/${date}/${photo}`);
};

// Hook to use photos from date folder
export const usePhotosFromDate = (date: string, existingPhotos?: string[]): string[] => {
  // If there are existing photos defined, use those
  if (existingPhotos && existingPhotos.length > 0) {
    return existingPhotos;
  }
  
  // Otherwise, try to get photos from the date folder
  return getPhotosFromDateFolder(date);
};