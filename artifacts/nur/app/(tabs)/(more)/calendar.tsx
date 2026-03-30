import React, { useState } from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GeometricBackground } from '@/components/GeometricBackground';
import { theme } from '@/constants/colors';
import { ISLAMIC_EVENTS } from '@/data/islamicEvents';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const { hijriDate } = usePrayerTimes();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = now.getDate();
  const isCurrentMonth = now.getMonth() === month && now.getFullYear() === year;

  const cells = Array.from({ length: firstDay + daysInMonth }).map((_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );
  while (cells.length % 7 !== 0) cells.push(null);

  const goBack = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
  };
  const goFwd = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
  };

  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <GeometricBackground />
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: bottomPad + 80 }]}>
        {hijriDate ? (
          <View style={s.hijriBar}>
            <Text style={s.hijriTxt}>{hijriDate}</Text>
          </View>
        ) : null}

        {/* Month nav */}
        <View style={s.monthNav}>
          <TouchableOpacity activeOpacity={0.7} onPress={goBack} style={s.navBtn}>
            <Text style={s.navArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={s.monthTitle}>{MONTHS[month]} {year}</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={goFwd} style={s.navBtn}>
            <Text style={s.navArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Day labels */}
        <View style={s.dayRow}>
          {DAYS.map(d => <Text key={d} style={s.dayHeader}>{d}</Text>)}
        </View>

        {/* Calendar grid */}
        <View style={s.grid}>
          {cells.map((day, i) => (
            <View
              key={i}
              style={[
                s.cell,
                day && isCurrentMonth && day === today && s.cellToday,
                day && isCurrentMonth && day === today && s.cellTodayBg,
              ]}
            >
              {day ? <Text style={[s.cellText, day && isCurrentMonth && day === today && s.cellTodayTxt]}>{day}</Text> : null}
            </View>
          ))}
        </View>

        {/* Upcoming Islamic Events */}
        <Text style={s.eventsTitle}>Islamic Events</Text>
        {ISLAMIC_EVENTS.map((evt, i) => (
          <View key={i} style={s.eventCard}>
            <View style={s.eventDot} />
            <View style={{ flex: 1 }}>
              <Text style={s.eventName}>{evt.name}</Text>
              <Text style={s.eventHijri}>{evt.hijriDay} {['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Jumada al-Awwal','Jumada al-Thani','Rajab',"Sha'ban",'Ramadan','Shawwal',"Dhul Qi'dah",'Dhul Hijjah'][evt.hijriMonth - 1]}</Text>
              <Text style={s.eventDesc}>{evt.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  hijriBar: { backgroundColor: theme.colors.goldDim, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)', alignSelf: 'flex-start' },
  hijriTxt: { fontSize: 12, color: theme.colors.gold, fontWeight: '700' },
  monthNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  navBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
  navArrow: { fontSize: 22, color: theme.colors.gold, lineHeight: 24 },
  monthTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  dayRow: { flexDirection: 'row', marginBottom: 6 },
  dayHeader: { flex: 1, textAlign: 'center', fontSize: 11, color: theme.colors.text3, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
  cell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  cellToday: { borderWidth: 1.5, borderColor: theme.colors.gold },
  cellTodayBg: { backgroundColor: theme.colors.goldDim },
  cellText: { fontSize: 13, color: theme.colors.text },
  cellTodayTxt: { color: theme.colors.gold, fontWeight: '800' },
  eventsTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 12 },
  eventCard: { flexDirection: 'row', gap: 14, backgroundColor: theme.colors.surface, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'flex-start' },
  eventDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.gold, marginTop: 5 },
  eventName: { fontSize: 14, fontWeight: '700', color: theme.colors.text, marginBottom: 2 },
  eventHijri: { fontSize: 11, color: theme.colors.gold, marginBottom: 4 },
  eventDesc: { fontSize: 12, color: theme.colors.text2, lineHeight: 18 },
});
