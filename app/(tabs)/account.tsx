import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Journal } from '@/constants/theme';

type Mode = 'signin' | 'signup';

export default function AccountScreen() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isSignIn = mode === 'signin';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.inner}>
          {/* Logo / Title */}
          <View style={styles.logoArea}>
            <Text style={styles.logoEmoji}>📖</Text>
            <Text style={styles.appName}>Memories</Text>
            <Text style={styles.tagline}>Your personal journal</Text>
          </View>

          {/* Mode toggle */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, isSignIn && styles.toggleBtnActive]}
              onPress={() => setMode('signin')}
            >
              <Text style={[styles.toggleText, isSignIn && styles.toggleTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, !isSignIn && styles.toggleBtnActive]}
              onPress={() => setMode('signup')}
            >
              <Text style={[styles.toggleText, !isSignIn && styles.toggleTextActive]}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={Journal.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
              <View style={styles.inputUnderline} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Journal.textMuted}
                secureTextEntry
                autoComplete={isSignIn ? 'current-password' : 'new-password'}
              />
              <View style={styles.inputUnderline} />
            </View>

            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>
                {isSignIn ? 'Sign In' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipBtn}>
              <Text style={styles.skipText}>Continue without account</Text>
            </TouchableOpacity>
          </View>

          {/* Placeholder notice */}
          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              🔒 Account sync coming soon. Your entries are saved locally on this device.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Journal.cream,
  },
  flex: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    gap: 28,
  },
  logoArea: {
    alignItems: 'center',
    gap: 6,
  },
  logoEmoji: {
    fontSize: 48,
  },
  appName: {
    fontSize: 32,
    fontFamily: Platform.select({ ios: 'ui-serif', default: 'serif' }),
    color: Journal.textPrimary,
  },
  tagline: {
    fontSize: 14,
    color: Journal.textMuted,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: Journal.paper,
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: Journal.accent,
  },
  toggleText: {
    fontSize: 14,
    color: Journal.textMuted,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#fff',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 12,
    color: Journal.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    fontSize: 16,
    color: Journal.textPrimary,
    paddingVertical: 8,
  },
  inputUnderline: {
    height: 1,
    backgroundColor: Journal.rule,
  },
  primaryBtn: {
    backgroundColor: Journal.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 14,
    color: Journal.textMuted,
    textDecorationLine: 'underline',
  },
  notice: {
    backgroundColor: Journal.paper,
    borderRadius: 10,
    padding: 14,
  },
  noticeText: {
    fontSize: 13,
    color: Journal.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
