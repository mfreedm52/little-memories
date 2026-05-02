import React from 'react';
import { Image } from 'react-native';

import FilmFrame from './FilmFrame';
import MinimalFrame from './MinimalFrame';
import OrnateFrame from './OrnateFrame';
import PolaroidFrame from './PolaroidFrame';
import WashiFrame from './WashiFrame';
import WoodFrame from './WoodFrame';

interface Props {
  uri: string;
  frameId: string;
  size: number;
  idx?: number;
}

export default function FramedPhoto({ uri, frameId, size, idx = 0 }: Props) {
  const p = { uri, size, idx };
  switch (frameId) {
    case 'polaroid': return <PolaroidFrame {...p} />;
    case 'minimal':  return <MinimalFrame {...p} />;
    case 'film':     return <FilmFrame {...p} />;
    case 'washi':    return <WashiFrame {...p} />;
    case 'wood':     return <WoodFrame {...p} />;
    case 'ornate':   return <OrnateFrame {...p} />;
    default:
      return (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: 8 }}
          resizeMode="cover"
        />
      );
  }
}
