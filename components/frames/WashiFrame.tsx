import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props {
  uri: string;
  size: number;
  idx?: number;
}

const TAPE_COLORS = ['#f4b6a8', '#9ec3b8', '#e8c97a', '#c8a6cf'];

export default function WashiFrame({ uri, size, idx = 0 }: Props) {
  const pad = Math.round(size * 0.08);
  const tapeW = Math.round(size * 0.32);
  const tapeH = Math.round(size * 0.09);
  const imgSize = size - pad * 2;

  const tapes = [
    { top: -(tapeH * 0.45), left: size * 0.04, rot: '-28deg', color: TAPE_COLORS[idx % 4] },
    { top: -(tapeH * 0.6), right: size * 0.02, rot: '22deg', color: TAPE_COLORS[(idx + 1) % 4] },
    { bottom: -(tapeH * 0.45), left: size * 0.02, rot: '18deg', color: TAPE_COLORS[(idx + 2) % 4] },
    { bottom: -(tapeH * 0.35), right: size * 0.04, rot: '-24deg', color: TAPE_COLORS[(idx + 3) % 4] },
  ];

  return (
    <View style={[s.outer, { width: size, height: size, padding: pad }]}>
      <Image source={{ uri }} style={{ width: imgSize, height: imgSize }} resizeMode="cover" />
      {tapes.map((t, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: t.top,
            bottom: t.bottom,
            left: t.left,
            right: t.right,
            width: tapeW,
            height: tapeH,
            backgroundColor: t.color,
            opacity: 0.85,
            transform: [{ rotate: t.rot }],
          }}
        />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  outer: {
    backgroundColor: '#fdf6e8',
    transform: [{ rotate: '0.8deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
});
