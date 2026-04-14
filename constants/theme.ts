/**
 * App color palette and typography.
 * Journal colors use warm cream/amber tones to evoke a physical photo album.
 */

import { Platform } from 'react-native';

const tintColorLight = '#C8863A';
const tintColorDark = '#E8A85A';

export const Colors = {
  light: {
    text: '#2C1A0E',
    background: '#FBF7F0',
    tint: tintColorLight,
    icon: '#9C8672',
    tabIconDefault: '#9C8672',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#EDE0D0',
    background: '#1C1410',
    tint: tintColorDark,
    icon: '#7C6A5A',
    tabIconDefault: '#7C6A5A',
    tabIconSelected: tintColorDark,
  },
};

/** Journal-specific palette (not theme-aware — used directly in journal screens) */
export const Journal = {
  cream: '#FBF7F0',
  paper: '#FFFDF7',
  accent: '#C8863A',
  accentDark: '#E8A85A',
  textPrimary: '#2C1A0E',
  textMuted: '#9C8672',
  rule: '#E8DDD0',       // horizontal lines on journal page
  photoBackground: '#F0E8DC',
  shadow: 'rgba(44, 26, 14, 0.12)',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
