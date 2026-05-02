import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props {
  uri: string;
  size: number;
  idx?: number;
}

export default function PolaroidFrame({ uri, size, idx = 0 }: Props) {
  const pad = Math.round(size * 0.05);
  const captionH = Math.round(size * 0.18);
  const imgW = size - pad * 2;
  const imgH = size - pad * 2 - captionH;
  const rot = idx % 2 === 0 ? '-1.5deg' : '1.2deg';

  return (
    <View
      style={[
        s.outer,
        { width: size, height: size, padding: pad, transform: [{ rotate: rot }] },
      ]}
    >
      <Image source={{ uri }} style={{ width: imgW, height: imgH }} resizeMode="cover" />
    </View>
  );
}

const s = StyleSheet.create({
  outer: {
    backgroundColor: '#fdfaf2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
});
