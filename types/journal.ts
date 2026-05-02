export interface PhotoEntry {
  uri: string;
  frameId: string;
}

export interface JournalEntry {
  date: string;      // "YYYY-MM-DD"
  text: string;
  photos: PhotoEntry[];
  updatedAt: string; // ISO timestamp
}
