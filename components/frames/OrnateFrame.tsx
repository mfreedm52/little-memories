import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props {
  uri: string;
  size: number;
  idx?: number;
}

export default function OrnateFrame({ uri, size }: Props) {
  const border = Math.round(size * 0.11);
  const innerSize = size - border * 2;
  const insetBy = border - 4;

  return (
    <View style={[s.outer, { width: size, height: size, padding: border, borderRadius: 4 }]}>
      {/* Inner decorative border ring */}
      <View
        style={{
          position: 'absolute',
          top: insetBy,
          left: insetBy,
          right: insetBy,
          bottom: insetBy,
          borderWidth: 2,
          borderColor: 'rgba(120,80,20,0.55)',
        }}
      />
      <Image
        source={{ uri }}
        style={{ width: innerSize, height: innerSize, borderWidth: 1, borderColor: 'rgba(0,0,0,0.25)' }}
        resizeMode="cover"
      />
    </View>
  );
}

const s = StyleSheet.create({
  outer: {
    backgroundColor: '#c79330',
    shadowColor: 'rgba(60,40,10,1)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
});
