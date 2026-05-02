import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props {
  uri: string;
  size: number;
  idx?: number;
}

export default function WoodFrame({ uri, size }: Props) {
  const border = Math.round(size * 0.08);
  const innerSize = size - border * 2 - 4; // 2px border on inner View each side

  return (
    <View style={[s.outer, { width: size, height: size, padding: border }]}>
      <View style={s.inner}>
        <Image source={{ uri }} style={{ width: innerSize, height: innerSize }} resizeMode="cover" />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  outer: {
    backgroundColor: '#6b4022',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 10,
    elevation: 7,
  },
  inner: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'rgba(20,10,5,0.7)',
  },
});
