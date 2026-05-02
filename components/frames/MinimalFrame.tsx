import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props {
  uri: string;
  size: number;
  idx?: number;
}

export default function MinimalFrame({ uri, size }: Props) {
  const border = Math.max(5, Math.round(size * 0.025));
  const mat = Math.round(size * 0.06);
  const innerSize = size - (border + mat) * 2;

  return (
    <View style={[s.outer, { width: size, height: size, padding: border }]}>
      <View style={[s.mat, { padding: mat }]}>
        <Image source={{ uri }} style={{ width: innerSize, height: innerSize }} resizeMode="cover" />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  outer: {
    backgroundColor: '#0a0a0c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 7,
  },
  mat: {
    flex: 1,
    backgroundColor: '#f6f1e7',
  },
});
