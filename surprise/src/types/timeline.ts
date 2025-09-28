export interface TimelineEntry {
  id: string;
  date: string; // Format: "YYYY-MM-DD"
  title: string; // e.g., "Our First Date", "Movie Night", "Trip to Paris"
  description?: string; // Optional longer description
  memories?: string[]; // Array of memorable moments from that time
  songs?: Song[]; // Songs you listened to or that were special
  movies?: Movie[]; // Movies you watched together
  jokes?: string[]; // Jokes you shared
  photos?: string[]; // Optional: photo URLs or paths
  videos?: string[]; // Optional: video URLs or paths
  location?: string; // Where this happened
  category?: 'date' | 'milestone' | 'trip' | 'celebration' | 'everyday' | 'special' | 'vacation';
  // Vacation-specific fields
  duration?: string; // e.g., "3 days", "1 week"
  highlights?: string[]; // Key vacation highlights
  activities?: string[]; // Activities done during vacation
  endDate?: string; // Format: "YYYY-MM-DD" for multi-day vacations
}

export interface Song {
  title: string;
  artist: string;
  note?: string;
}

export interface Movie {
  title: string;
  year?: number;
  note?: string;
}

export interface MonthlyRecap {
  monthYear: string; // Format: "YYYY-M" (e.g., "2024-2" for February 2024)
  summary: string; // Overall summary of the month
  favoriteDate: {
    entryId: string; // References the ID of the favorite timeline entry
    reason: string; // Why this was the favorite date
  };
  monthHighlights?: string[]; // Optional additional highlights
}

export interface TimelineData {
  entries: TimelineEntry[];
  relationshipStart: string;
  names: {
    person1: string;
    person2: string;
  };
  monthlyRecaps?: MonthlyRecap[]; // Optional monthly recaps
}