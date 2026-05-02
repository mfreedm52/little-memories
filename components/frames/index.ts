export const FRAMES = [
  { id: 'none',     name: 'None'     },
  { id: 'polaroid', name: 'Polaroid' },
  { id: 'minimal',  name: 'Minimal'  },
  { id: 'film',     name: 'Film'     },
  { id: 'washi',    name: 'Washi'    },
  { id: 'wood',     name: 'Wood'     },
  { id: 'ornate',   name: 'Ornate'   },
] as const;

export type FrameId = (typeof FRAMES)[number]['id'];

export function frameById(id: string) {
  return FRAMES.find((f) => f.id === id) ?? FRAMES[0];
}
