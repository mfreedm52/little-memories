import React, { useState } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Journal } from '@/constants/theme';
import FramedPhoto from './frames/FramedPhoto';
import { FRAMES } from './frames';

interface Props {
  visible: boolean;
  photoUri: string;
  onConfirm: (frameId: string) => void;
  onDismiss: () => void;
}

export default function FramePickerModal({ visible, photoUri, onConfirm, onDismiss }: Props) {
  const [selectedId, setSelectedId] = useState('none');

  const handleConfirm = () => {
    onConfirm(selectedId);
    setSelectedId('none');
  };

  const handleDismiss = () => {
    onDismiss();
    setSelectedId('none');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleDismiss}
    >
      <View style={s.overlay}>
        <View style={s.sheet}>
          {/* Header row */}
          <View style={s.header}>
            <TouchableOpacity onPress={handleDismiss} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <Text style={s.skipBtn}>Skip</Text>
            </TouchableOpacity>
            <Text style={s.headerTitle}>Choose Frame</Text>
            <TouchableOpacity onPress={handleConfirm} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <Text style={s.useBtn}>Use Frame</Text>
            </TouchableOpacity>
          </View>

          {/* Hero preview */}
          <View style={s.hero}>
            {photoUri ? (
              <FramedPhoto uri={photoUri} frameId={selectedId} size={240} idx={0} />
            ) : null}
          </View>

          {/* Active frame name */}
          <Text style={s.frameName}>
            {FRAMES.find((f) => f.id === selectedId)?.name ?? 'None'}
          </Text>

          {/* Thumbnail row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.thumbRow}
          >
            {FRAMES.map((f, i) => {
              const active = f.id === selectedId;
              return (
                <TouchableOpacity
                  key={f.id}
                  style={s.thumbBtn}
                  onPress={() => setSelectedId(f.id)}
                  activeOpacity={0.7}
                >
                  <View style={{ opacity: active ? 1 : 0.45 }}>
                    {photoUri ? (
                      <FramedPhoto uri={photoUri} frameId={f.id} size={56} idx={i} />
                    ) : null}
                  </View>
                  {active && <View style={s.activeBar} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: Journal.cream,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Journal.rule,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Journal.textPrimary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  skipBtn: {
    fontSize: 15,
    color: Journal.textMuted,
  },
  useBtn: {
    fontSize: 15,
    color: Journal.accent,
    fontWeight: '500',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 28,
    minHeight: 296,
    justifyContent: 'center',
  },
  frameName: {
    textAlign: 'center',
    fontSize: 12,
    color: Journal.textMuted,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  thumbRow: {
    paddingHorizontal: 20,
    gap: 16,
    alignItems: 'center',
    paddingBottom: 4,
  },
  thumbBtn: {
    alignItems: 'center',
    gap: 8,
  },
  activeBar: {
    width: 16,
    height: 2,
    backgroundColor: Journal.textPrimary,
    borderRadius: 1,
  },
});
