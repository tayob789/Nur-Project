import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { theme } from '@/constants/colors';
import type { Prayer } from '@/hooks/usePrayerTimes';

interface PrayerTimelineProps {
  prayers: Prayer[];
  nextPrayerIndex: number;
}

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function PrayerTimeline({ prayers, nextPrayerIndex }: PrayerTimelineProps) {
  if (prayers.length === 0) return null;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const dayStart = 0;
  const dayEnd = 24 * 60;

  const W = 320;
  const H = 40;
  const lineY = 20;
  const leftPad = 12;
  const rightPad = 12;
  const lineW = W - leftPad - rightPad;

  const toX = (mins: number) => leftPad + (mins / dayEnd) * lineW;
  const nowX = toX(nowMinutes);

  return (
    <View style={s.container}>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <Line
          x1={leftPad} y1={lineY} x2={W - rightPad} y2={lineY}
          stroke={theme.colors.border2} strokeWidth={1.5}
        />

        {prayers.map((p, i) => {
          const mins = timeToMinutes(p.time);
          const x = toX(mins);
          const isNext = i === nextPrayerIndex && !p.done;
          const color = p.done ? theme.colors.teal : isNext ? theme.colors.gold : theme.colors.text3;
          return (
            <React.Fragment key={p.name}>
              <Circle cx={x} cy={lineY} r={isNext ? 6 : 4} fill={color} opacity={isNext ? 1 : 0.85} />
              <SvgText
                x={x}
                y={lineY - 9}
                fontSize="7"
                fill={color}
                textAnchor="middle"
              >
                {p.name.substring(0, 3)}
              </SvgText>
            </React.Fragment>
          );
        })}

        <Line
          x1={nowX} y1={lineY - 8} x2={nowX} y2={lineY + 8}
          stroke={theme.colors.goldLight} strokeWidth={1.5}
        />
      </Svg>
    </View>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 4, marginTop: 12 },
});
