import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Path, Pattern, Rect } from 'react-native-svg';

export function GeometricBackground() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <Pattern id="geo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <Path
              d="M40 4 L46 18 L62 18 L50 27 L55 42 L40 33 L25 42 L30 27 L18 18 L34 18 Z"
              stroke="rgba(201,168,76,0.07)"
              strokeWidth="0.6"
              fill="none"
            />
            <Path
              d="M40 4 L40 76 M4 40 L76 40"
              stroke="rgba(201,168,76,0.025)"
              strokeWidth="0.3"
              fill="none"
            />
            <Path
              d="M4 4 L76 76 M76 4 L4 76"
              stroke="rgba(201,168,76,0.02)"
              strokeWidth="0.3"
              fill="none"
            />
            <Path
              d="M0 20 L20 0 M60 0 L80 20 M80 60 L60 80 M0 60 L20 80"
              stroke="rgba(201,168,76,0.03)"
              strokeWidth="0.4"
              fill="none"
            />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#geo)" />
      </Svg>
    </View>
  );
}
