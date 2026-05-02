import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface Props {
  uri: string;
  size: number;
  idx?: number;
}

function SprocketRow({ size }: { size: number }) {
  const h = Math.round(size * 0.09);
  const holeW = Math.round(size * 0.06);
  const holeH = Math.round(size * 0.045);
  return (
    <View
      style={{
        height: h,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: Math.round(size * 0.03),
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <View
          key={i}
          style={{ width: holeW, height: holeH, backgroundColor: '#fdf6e8', borderRadius: 1 }}
        />
      ))}
    </View>
  );
}

export default function FilmFrame({ uri, size, idx = 0 }: Props) {
  const stripH = Math.round(size * 0.09);
  const imgH = size - stripH * 2;
  const labelSize = Math.max(7, Math.round(size * 0.07));

  return (
    <View style={[s.outer, { width: size, height: size }]}>
      <SprocketRow size={size} />
      <View>
        <Image source={{ uri }} style={{ width: size, height: imgH }} resizeMode="cover" />
        <Text
          style={{
            position: 'absolute',
            bottom: 4,
            left: Math.round(size * 0.06),
            fontFamily: 'monospace',
            fontSize: labelSize,
            color: '#e8a23a',
            fontWeight: '700',
            letterSpacing: 1,
          }}
        >
          KODAK {String(24 + idx).padStart(2, '0')}A
        </Text>
      </View>
      <SprocketRow size={size} />
    </View>
  );
}

const s = StyleSheet.create({
  outer: {
    backgroundColor: '#1a1612',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 7,
  },
});
