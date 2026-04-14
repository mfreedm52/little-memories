import { Href, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Journal } from '@/constants/theme';
import { getAllEntryDates } from '@/lib/storage';

type MarkedDates = Record<string, { marked: boolean; dotColor: string; selected?: boolean; selectedColor?: string }>;

export default function HistoryScreen() {
  const router = useRouter();
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  useEffect(() => {
    getAllEntryDates().then((dates) => {
      const marks: MarkedDates = {};
      for (const d of dates) {
        marks[d] = { marked: true, dotColor: Journal.accent };
      }
      setMarkedDates(marks);
    });
  }, []);

  const handleDayPress = (day: DateData) => {
    router.push(`/entry/${day.dateString}` as Href);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Journal History</Text>
      </View>

      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        maxDate={new Date().toISOString().split('T')[0]}
        theme={{
          backgroundColor: Journal.cream,
          calendarBackground: Journal.paper,
          textSectionTitleColor: Journal.textMuted,
          selectedDayBackgroundColor: Journal.accent,
          selectedDayTextColor: '#fff',
          todayTextColor: Journal.accent,
          dayTextColor: Journal.textPrimary,
          textDisabledColor: Journal.rule,
          dotColor: Journal.accent,
          selectedDotColor: '#fff',
          arrowColor: Journal.accent,
          monthTextColor: Journal.textPrimary,
          textDayFontFamily: undefined,
          textMonthFontFamily: undefined,
          textDayHeaderFontFamily: undefined,
          textMonthFontSize: 18,
          textDayFontSize: 15,
        }}
        style={styles.calendar}
      />

      <View style={styles.legend}>
        <View style={styles.legendDot} />
        <Text style={styles.legendText}>Days with entries</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Journal.cream,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'serif',
    color: Journal.textPrimary,
  },
  calendar: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Journal.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Journal.accent,
  },
  legendText: {
    fontSize: 13,
    color: Journal.textMuted,
  },
});
