# AiChat Browser - Build Instructions

## Platform Support

- ✅ **Electron** (Windows, macOS, Linux)
- ✅ **Capacitor** (Android, iOS)
- ⚠️ **Web** (Shows download page only)

## Prerequisites

- Node.js 18+ and npm
- For Android: Android Studio with SDK
- For iOS: Xcode (macOS only)
- For Electron: No additional requirements

## Development

### Start Development Server

```bash
npm install
npm run dev
```

### Electron Development

```bash
npm run electron:dev
```

This will start both Vite dev server and Electron app.

## Building

### Build Web Assets

```bash
npm run build
```

### Electron Build

#### Windows
```bash
npm run electron:build -- --win
```

#### macOS
```bash
npm run electron:build -- --mac
```

#### Linux
```bash
npm run electron:build -- --linux
```

Output will be in `dist-electron/` folder.

### Capacitor Build

#### Initial Setup (First Time Only)

```bash
# Initialize Capacitor (if not done)
npm run capacitor:init

# Add platforms
npm run capacitor:add:android
npm run capacitor:add:ios
```

#### Android Build

```bash
# Build web assets
npm run build

# Sync with Capacitor
npm run capacitor:sync

# Open in Android Studio
npm run capacitor:open:android
```

Then build APK/AAB from Android Studio.

#### iOS Build

```bash
# Build web assets
npm run build

# Sync with Capacitor
npm run capacitor:sync

# Open in Xcode
npm run capacitor:open:ios
```

Then build IPA from Xcode.

## Platform-Specific Features

### Electron
- Native webview with full browser capabilities
- Hardware acceleration disabled to prevent black screens
- Window shows only when ready to prevent flashing
- Auto-retry on dev server connection failure

### Capacitor
- Mobile-optimized iframe rendering
- Splash screen with app branding
- Keyboard resize handling
- Mixed content support for Android
- Camera, microphone, and geolocation permissions

### Web
- Displays download page only
- Detects user's OS and recommends appropriate download
- No browser functionality (use Electron/Capacitor apps)

## Troubleshooting

### Electron Black Screen
- Already fixed with `app.disableHardwareAcceleration()`
- Window shows only when `ready-to-show` event fires
- Background color set to white

### Electron Dev Mode Connection Issues
- Ensure Vite dev server is running on port 5173
- Auto-retry implemented for connection failures
- Check firewall settings

### Capacitor Build Issues
- Run `npm run capacitor:sync` after any web changes
- Clear build cache in Android Studio/Xcode
- Check `capacitor.config.ts` for correct paths

### CORS Issues
- Update backend `.env` with correct frontend URL
- For dev: Add `http://localhost:5173` and `http://localhost:5175`
- For Capacitor: Add `capacitor://localhost` and `https://localhost`

## Configuration Files

- `electron/main.cjs` - Electron main process
- `electron/preload.js` - Electron preload script
- `capacitor.config.ts` - Capacitor configuration
- `vite.config.mjs` - Vite build configuration
- `package.json` - Dependencies and scripts

## Environment Variables

Create `.env` in frontend root (optional):

```env
VITE_API_URL=http://localhost:8000
```

## Notes

- The app uses platform detection to show appropriate UI
- Web version redirects to download page
- Electron uses webview tags for better isolation
- Capacitor uses iframes with mobile optimizations
- All platforms share the same React codebase
