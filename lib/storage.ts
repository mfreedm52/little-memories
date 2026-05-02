import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';
import { JournalEntry, PhotoEntry } from '@/types/journal';

const ENTRY_KEY_PREFIX = 'journal_entry_';
const DATES_INDEX_KEY = 'journal_entry_dates';

export async function getEntry(date: string): Promise<JournalEntry | null> {
  try {
    const raw = await AsyncStorage.getItem(`${ENTRY_KEY_PREFIX}${date}`);
    if (!raw) return null;
    const entry = JSON.parse(raw) as JournalEntry;
    // Migrate old format: photos was string[]
    entry.photos = (entry.photos as unknown as (PhotoEntry | string)[]).map((p) =>
      typeof p === 'string' ? { uri: p, frameId: 'none' } : p,
    );
    return entry;
  } catch {
    return null;
  }
}

export async function saveEntry(entry: JournalEntry): Promise<void> {
  await AsyncStorage.setItem(
    `${ENTRY_KEY_PREFIX}${entry.date}`,
    JSON.stringify(entry),
  );
  // Update dates index
  const dates = await getAllEntryDates();
  if (!dates.includes(entry.date)) {
    await AsyncStorage.setItem(
      DATES_INDEX_KEY,
      JSON.stringify([...dates, entry.date]),
    );
  }
}

export async function getAllEntryDates(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(DATES_INDEX_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

/**
 * Returns every photo from every entry, sorted newest-first by entry date.
 */
export async function getAllPhotos(): Promise<Array<PhotoEntry & { date: string }>> {
  const dates = await getAllEntryDates();
  const entries = await Promise.all(dates.map(getEntry));
  return entries
    .filter((e): e is JournalEntry => e !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
    .flatMap((e) => e.photos.map((p) => ({ ...p, date: e.date })))
    .filter((p) => Boolean(p.uri));
}

/**
 * Copies a photo URI into the app's local documents directory and returns the
 * new permanent URI. On web the file system API is unavailable, so the source
 * URI is returned as-is.
 */
export function copyPhotoToLocal(sourceUri: string): Promise<string> {
  if (Platform.OS === 'web') {
    return Promise.resolve(sourceUri);
  }
  const dir = new Directory(Paths.document, 'journal-photos');
  if (!dir.exists) {
    dir.create();
  }
  const filename = `photo_${Date.now()}.jpg`;
  const dest = new File(dir, filename);
  const src = new File(sourceUri);
  src.copy(dest);
  return Promise.resolve(dest.uri);
}
