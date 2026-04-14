import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Journal } from '@/constants/theme';
import { copyPhotoToLocal, getEntry, saveEntry } from '@/lib/storage';
import { JournalEntry } from '@/types/journal';

function formatDate(dateKey: string): { dayOfWeek: string; monthDay: string } {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  return { dayOfWeek, monthDay };
}

const LINE_HEIGHT = 32;
const NUM_LINES = 20;
const PAPER_PAD_TOP = 8;
const PAPER_PAD_H = 16;
const PAPER_PAD_BOTTOM = 16;
const PAPER_HEIGHT = PAPER_PAD_TOP + NUM_LINES * LINE_HEIGHT + PAPER_PAD_BOTTOM;

export default function EntryScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const { dayOfWeek, monthDay } = formatDate(date);

  const [text, setText] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getEntry(date).then((entry) => {
      if (entry) {
        setText(entry.text);
        setPhotos(entry.photos);
      }
    });
  }, [date]);

  const persist = useCallback(
    (newText: string, newPhotos: string[]) => {
      const entry: JournalEntry = {
        date,
        text: newText,
        photos: newPhotos,
        updatedAt: new Date().toISOString(),
      };
      saveEntry(entry);
    },
    [date],
  );

  const handleTextChange = (value: string) => {
    setText(value);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persist(value, photos), 500);
  };

  const handleAddPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
      allowsEditing: false,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newUris = await Promise.all(
        result.assets.map((a) => copyPhotoToLocal(a.uri)),
      );
      const updated = [...photos, ...newUris];
      setPhotos(updated);
      persist(text, updated);
    }
  };

  const handleRemovePhoto = (uri: string) => {
    const updated = photos.filter((p) => p !== uri);
    setPhotos(updated);
    persist(text, updated);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <IconSymbol name="chevron.right" size={20} color={Journal.accent} style={styles.backIcon} />
        <Text style={styles.backText}>History</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Date Header */}
          <View style={styles.dateHeader}>
            <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
            <Text style={styles.monthDay}>{monthDay}</Text>
          </View>

          <View style={styles.divider} />

          {/* Photo Strip */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photoStrip}
            contentContainerStyle={styles.photoStripContent}
          >
            {photos.map((uri) => (
              <View key={uri} style={styles.photoWrapper}>
                <Image source={{ uri }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemovePhoto(uri)}
                  hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                >
                  <IconSymbol name="xmark.circle.fill" size={20} color={Journal.accent} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addPhotoBtn} onPress={handleAddPhoto}>
              <IconSymbol name="photo.on.rectangle" size={24} color={Journal.textMuted} />
              <Text style={styles.addPhotoLabel}>Add photo</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Ruled Paper Text Area */}
          <View style={styles.paperCard}>
            <View style={styles.ruledBackground} pointerEvents="none">
              {Array.from({ length: NUM_LINES }).map((_, i) => (
                <View key={i} style={styles.ruleLine} />
              ))}
            </View>
            <TextInput
              style={[StyleSheet.absoluteFillObject, styles.textInput]}
              multiline
              placeholder="Write something..."
              placeholderTextColor={Journal.textMuted}
              value={text}
              onChangeText={handleTextChange}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Journal.cream,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backIcon: {
    transform: [{ scaleX: -1 }],
  },
  backText: {
    fontSize: 16,
    color: Journal.accent,
    marginLeft: 2,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  dateHeader: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
  },
  dayOfWeek: {
    fontSize: 32,
    fontFamily: Platform.select({ ios: 'ui-serif', default: 'serif' }),
    color: Journal.textPrimary,
    lineHeight: 38,
  },
  monthDay: {
    fontSize: 16,
    color: Journal.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Journal.rule,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  photoStrip: {
    marginBottom: 20,
  },
  photoStripContent: {
    paddingHorizontal: 24,
    gap: 12,
    alignItems: 'center',
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: Journal.photoBackground,
  },
  removeBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Journal.paper,
    borderRadius: 12,
  },
  addPhotoBtn: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Journal.rule,
    borderStyle: 'dashed',
    backgroundColor: Journal.photoBackground,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addPhotoLabel: {
    fontSize: 11,
    color: Journal.textMuted,
  },
  paperCard: {
    marginHorizontal: 16,
    height: PAPER_HEIGHT,
    backgroundColor: Journal.paper,
    borderRadius: 12,
    shadowColor: Journal.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  ruledBackground: {
    position: 'absolute',
    top: PAPER_PAD_TOP,
    left: 0,
    right: 0,
  },
  ruleLine: {
    height: LINE_HEIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Journal.rule,
  },
  textInput: {
    paddingTop: PAPER_PAD_TOP,
    paddingHorizontal: PAPER_PAD_H,
    paddingBottom: PAPER_PAD_BOTTOM,
    fontSize: 16,
    lineHeight: LINE_HEIGHT,
    color: Journal.textPrimary,
    fontFamily: Platform.select({ ios: 'ui-serif', default: 'serif' }),
  },
});
