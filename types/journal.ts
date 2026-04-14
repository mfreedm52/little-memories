export interface JournalEntry {
  date: string;      // "YYYY-MM-DD"
  text: string;
  photos: string[];  // local file URIs
  updatedAt: string; // ISO timestamp
}
