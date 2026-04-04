import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Defs, G, Path, Pattern, Rect } from 'react-native-svg';

import { theme } from '@/constants/colors';

const { width, height } = Dimensions.get('screen');

export function GeometricBackground() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFillObject}>
        <Defs>
          <Pattern id="islamicPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <G opacity="0.055">
              <Path
                d="M40 8 L44 28 L64 24 L50 38 L64 56 L44 52 L40 72 L36 52 L16 56 L30 38 L16 24 L36 28 Z"
                stroke={theme.colors.gold}
                strokeWidth="0.7"
                fill="none"
              />
              <Path
                d="M40 20 L42 30 L52 28 L46 36 L52 46 L42 44 L40 54 L38 44 L28 46 L34 36 L28 28 L38 30 Z"
                stroke={theme.colors.gold}
                strokeWidth="0.4"
                fill="none"
                opacity="0.6"
              />
            </G>
            <G opacity="0.03">
              <Path d="M0 40 L80 40" stroke={theme.colors.gold} strokeWidth="0.3" fill="none" />
              <Path d="M40 0 L40 80" stroke={theme.colors.gold} strokeWidth="0.3" fill="none" />
            </G>
          </Pattern>
        </Defs>
        <Rect width={width} height={height} fill="url(#islamicPattern)" />
      </Svg>
    </View>
  );
}
