import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  Animated,
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
const ITEM_WIDTH = Math.min(Math.round(SCREEN_WIDTH * 0.72), 320);
const ITEM_GAP = 16;
const SIDE_PADDING = (SCREEN_WIDTH - ITEM_WIDTH) / 2;
const SNAP_INTERVAL = ITEM_WIDTH + ITEM_GAP;

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

function MemoryCard({
  item,
  index,
  scrollX,
}: {
  item: MemoryItem;
  index: number;
  scrollX: Animated.Value;
}) {
  const scale = scrollX.interpolate({
    inputRange: [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ],
    outputRange: [0.84, 1, 0.84],
    extrapolate: 'clamp',
  });
  const opacity = scrollX.interpolate({
    inputRange: [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ],
    outputRange: [0.4, 1, 0.4],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[s.card, { width: ITEM_WIDTH, transform: [{ scale }], opacity }]}>
      <FramedPhoto uri={item.uri} frameId={item.frameId} size={ITEM_WIDTH} idx={index} />
      <Text style={s.dateLabel}>{formatDate(item.date)}</Text>
    </Animated.View>
  );
}

export default function MemoriesScreen() {
  const [photos, setPhotos] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

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
          <Text style={s.emptySubtext}>
            Add photos to your journal entries{'\n'}and they'll appear here.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Memories</Text>
        <Text style={s.counter}>
          {currentIndex + 1} / {photos.length}
        </Text>
      </View>

      <View style={s.carouselContainer}>
        <FlatList
          data={photos}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SNAP_INTERVAL}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
          ItemSeparatorComponent={() => <View style={{ width: ITEM_GAP }} />}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: Platform.OS !== 'web' },
          )}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          keyExtractor={(item, i) => `${item.uri}-${i}`}
          renderItem={({ item, index }) => (
            <MemoryCard item={item} index={index} scrollX={scrollX} />
          )}
        />
      </View>

      {/* Dot indicators — shown when small enough to be meaningful */}
      {photos.length > 1 && photos.length <= 12 && (
        <View style={s.dots}>
          {photos.map((_, i) => (
            <View key={i} style={[s.dot, i === currentIndex && s.dotActive]} />
          ))}
        </View>
      )}
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
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    gap: 16,
  },
  dateLabel: {
    fontSize: 13,
    color: Journal.textMuted,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 28,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Journal.rule,
  },
  dotActive: {
    width: 18,
    backgroundColor: Journal.accent,
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
