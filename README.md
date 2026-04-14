# memories-app

A React Native mobile app built with [Expo](https://expo.dev), targeting Android and iOS.

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org) | 20+ | Runtime |
| [npm](https://npmjs.com) | 10+ | Package manager |
| [Expo CLI](https://docs.expo.dev/more/expo-cli/) | Latest | Local dev server |
| [EAS CLI](https://docs.expo.dev/eas/) | Latest | Cloud builds & submission |
| [Expo Go](https://expo.dev/go) | Latest | On-device testing (dev only) |
| Xcode 15+ | macOS only | iOS simulator / production builds |
| Android Studio | Any OS | Android emulator / production builds |

Install global CLIs:

```bash
npm install -g expo-cli eas-cli
```

---

## Local Development

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
npx expo start
```

This opens the Expo Dev Tools. From there you can:

- **Press `i`** — open in iOS Simulator (macOS + Xcode required)
- **Press `a`** — open in Android Emulator (Android Studio required)
- **Press `w`** — open in web browser
- **Scan the QR code** with Expo Go on a physical device

### Running on a physical device

1. Install **Expo Go** from the App Store or Google Play.
2. Make sure your phone and computer are on the same Wi-Fi network.
3. Run `npx expo start` and scan the QR code in Expo Go.

---

## Project Structure

```
memories-app/
├── app/                  # Expo Router screens (file-based routing)
│   ├── (tabs)/
│   │   ├── _layout.tsx   # Tab navigator configuration
│   │   └── index.tsx     # Home screen
│   └── _layout.tsx       # Root layout
├── assets/               # Images, fonts, icons
├── components/           # Shared UI components
├── constants/            # Theme colors, etc.
├── hooks/                # Custom React hooks
├── app.json              # Expo config (name, bundle ID, plugins)
├── package.json
└── tsconfig.json
```

---

## Configuration Before Deploying

Before building for production, update `app.json`:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.memoriesapp"
    },
    "android": {
      "package": "com.yourcompany.memoriesapp"
    }
  }
}
```

---

## Production Builds with EAS

[EAS Build](https://docs.expo.dev/build/introduction/) compiles your app in the cloud — no local Xcode or Android Studio required for building (though they are still needed for simulators).

### 1. Log in and configure EAS

```bash
eas login
eas build:configure
```

This creates an `eas.json` file with build profiles.

### 2. Build for Android

**Development build (APK for internal testing):**
```bash
eas build --platform android --profile preview
```

**Production build (AAB for Google Play):**
```bash
eas build --platform android --profile production
```

### 3. Build for iOS

> Requires an Apple Developer account ($99/year).

**Development build (IPA for TestFlight):**
```bash
eas build --platform ios --profile preview
```

**Production build (IPA for App Store):**
```bash
eas build --platform ios --profile production
```

EAS will prompt you to generate or reuse signing certificates and provisioning profiles automatically.

### 4. Build for both platforms simultaneously

```bash
eas build --platform all --profile production
```

---

## Submitting to App Stores

### Google Play Store

1. Create an app in the [Google Play Console](https://play.google.com/console).
2. Download the signing key JSON from the Console.
3. Submit with EAS:

```bash
eas submit --platform android
```

### Apple App Store

1. Create an app record in [App Store Connect](https://appstoreconnect.apple.com).
2. Submit with EAS:

```bash
eas submit --platform ios
```

EAS Submit handles uploading the IPA and filling in the build metadata.

---

## Over-the-Air (OTA) Updates

Expo supports pushing JS/asset updates to users without going through the app store, using [EAS Update](https://docs.expo.dev/eas-update/introduction/).

```bash
# Publish an update to the production channel
eas update --branch production --message "Fix typo on home screen"
```

> Note: OTA updates only apply to JavaScript and assets. Native code changes (new packages with native modules, app.json changes) still require a full EAS build.

---

## Environment Variables

For environment-specific config (API keys, endpoints), use Expo's [environment variables](https://docs.expo.dev/guides/environment-variables/):

1. Create `.env.local` for local development:

```
EXPO_PUBLIC_API_URL=https://api.example.com
```

2. Access in code:

```ts
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

3. For EAS builds, set secrets in the Expo dashboard or via:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value https://api.example.com
```

> Only variables prefixed with `EXPO_PUBLIC_` are bundled into the client. Never put private keys in `EXPO_PUBLIC_` variables.

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `npx expo start` | Start local dev server |
| `npx expo start --clear` | Start with cleared Metro cache |
| `npx expo doctor` | Check for configuration issues |
| `eas build:list` | View recent EAS builds |
| `eas update:list` | View recent OTA updates |
| `npm run reset-project` | Reset app to blank state (moves current `app/` to `app-example/`) |
