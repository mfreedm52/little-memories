import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FramedPhoto from '@/components/frames/FramedPhoto';
import { Journal } from '@/constants/theme';
import { getAllPhotos } from '@/lib/storage';
import { PhotoEntry } from '@/types/journal';

type MemoryItem = PhotoEntry & { date: string };

const SCREEN_WIDTH = Dimensions.get('window').width;
const PHOTO_SIZE = Math.min(SCREEN_WIDTH - 64, 360);

function formatDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.toLocaleDateString('en-US', { weekday: 'long' });
  const rest = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  return `${day} · ${rest}`;
}

export default function MemoriesScreen() {
  const [photos, setPhotos] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getAllPhotos().then((all) => {
        setPhotos(all);
        setCurrentIndex(0);
        setLoading(false);
      });
    }, []),
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  if (loading) {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.center}>
          <Text style={s.emptyText}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (photos.length === 0) {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.header}>
          <Text style={s.title}>Memories</Text>
        </View>
        <View style={s.center}>
          <Text style={s.emptyText}>No photos yet.</Text>
          <Text style={s.emptySubtext}>Add photos to your journal entries{'\n'}and they'll appear here.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header with counter */}
      <View style={s.header}>
        <Text style={s.title}>Memories</Text>
        <Text style={s.counter}>
          {currentIndex + 1} / {photos.length}
        </Text>
      </View>

      <FlatList
        data={photos}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.uri}-${index}`}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => (
          <View style={[s.slide, { width: SCREEN_WIDTH }]}>
            <FramedPhoto
              uri={item.uri}
              frameId={item.frameId}
              size={PHOTO_SIZE}
              idx={index}
            />
            <Text style={s.dateLabel}>{formatDate(item.date)}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Journal.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Journal.rule,
  },
  title: {
    fontSize: 28,
    fontFamily: Platform.select({ ios: 'ui-serif', default: 'serif' }),
    color: Journal.textPrimary,
  },
  counter: {
    fontSize: 14,
    color: Journal.textMuted,
    letterSpacing: 0.5,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 20,
  },
  dateLabel: {
    fontSize: 14,
    color: Journal.textMuted,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: Platform.select({ ios: 'ui-serif', default: 'serif' }),
    color: Journal.textPrimary,
  },
  emptySubtext: {
    fontSize: 14,
    color: Journal.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
