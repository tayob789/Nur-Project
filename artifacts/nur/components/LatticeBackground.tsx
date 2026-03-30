import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { theme } from '@/constants/colors';

interface LatticeBackgroundProps {
  opacity?: number;
}

export function LatticeBackground({ opacity = 0.04 }: LatticeBackgroundProps) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" opacity={opacity}>
        <G fill={theme.colors.gold} fillRule="evenodd">
          {Array.from({ length: 20 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => {
              const x = col * 80;
              const y = row * 80;
              return (
                <Path
                  key={`${row}-${col}`}
                  d={`M${x + 40},${y} L${x + 60},${y + 20} L${x + 80},${y + 20} L${x + 80},${y + 40} L${x + 60},${y + 60} L${x + 40},${y + 80} L${x + 20},${y + 60} L${x},${y + 40} L${x},${y + 20} L${x + 20},${y + 20} Z`}
                  stroke={theme.colors.gold}
                  strokeWidth={0.5}
                  fill="none"
                />
              );
            })
          )}
        </G>
      </Svg>
    </View>
  );
}
