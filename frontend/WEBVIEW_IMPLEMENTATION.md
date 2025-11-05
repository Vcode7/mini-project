# WebView Implementation for Electron & Capacitor

## Overview
Both Electron and Capacitor now use **native webview** instead of iframe for better performance, security, and capabilities.

## Why WebView Instead of Iframe?

### Performance
- **Native rendering**: Direct access to platform's native webview engine
- **Better memory management**: Native webview handles memory more efficiently
- **Hardware acceleration**: Full GPU support for smooth scrolling and animations

### Capabilities
- **Full browser features**: Access to all web APIs without iframe restrictions
- **No CORS limitations**: Can load any website without X-Frame-Options blocking
- **Better isolation**: Each webview runs in its own process
- **Session persistence**: Can maintain cookies and storage across restarts

### Mobile Benefits (Capacitor)
- **Native gestures**: Pinch-to-zoom, swipe navigation work naturally
- **Better touch handling**: Native touch event processing
- **Optimized for mobile**: Uses platform's optimized webview (WKWebView on iOS, WebView on Android)

## Implementation Details

### Electron WebView
```jsx
<webview
  src={url}
  className="w-full h-full"
  allowpopups="true"
  partition="persist:webview"
  useragent="Mozilla/5.0..."
/>
```

**Features:**
- Runs in separate process for isolation
- Persistent partition for session storage
- Custom user agent
- Popup support

### Capacitor WebView
```jsx
<CapacitorWebView
  url={url}
  className="w-full h-full"
/>
```

**Implementation:**
- Custom React component wrapping native webview element
- Dynamic webview creation and lifecycle management
- Event listeners for load states
- Proper cleanup on unmount

**Component Code:**
```javascript
// Creates native <webview> element dynamically
const webview = document.createElement('webview');
webview.src = url;
webview.setAttribute('allowpopups', 'true');
webview.setAttribute('partition', 'persist:webview');
```

## Platform Detection

The app automatically detects the platform and uses the appropriate webview:

```javascript
{isElectron() ? (
  <webview ... />
) : isCapacitor() ? (
  <CapacitorWebView ... />
) : (
  <div>Use desktop/mobile app</div>
)}
```

## Configuration

### Electron (electron/main.cjs)
```javascript
webPreferences: {
  webviewTag: true,  // Enable webview tag
  nodeIntegration: false,
  contextIsolation: true,
  sandbox: false
}
```

### Capacitor (capacitor.config.ts)
```typescript
android: {
  allowMixedContent: true,
  webContentsDebuggingEnabled: true
},
ios: {
  contentInset: 'automatic',
  scrollEnabled: true
}
```

## Webview vs Iframe Comparison

| Feature | Webview | Iframe |
|---------|---------|--------|
| Performance | ⚡ Native, fast | 🐌 Slower |
| CORS/X-Frame | ✅ No restrictions | ❌ Often blocked |
| Process Isolation | ✅ Separate process | ❌ Same process |
| Memory | ✅ Better managed | ⚠️ Can leak |
| Mobile Gestures | ✅ Native | ⚠️ Limited |
| Session Storage | ✅ Persistent | ⚠️ Limited |
| Browser APIs | ✅ Full access | ⚠️ Restricted |

## Testing

### Test Electron Webview
```bash
npm run electron:dev
```
- Should load websites without CORS errors
- Should support popups
- Should maintain session across reloads

### Test Capacitor Webview
```bash
npm run build
npm run capacitor:sync
npm run capacitor:open:android
```
- Test on real device for best results
- Check touch gestures work naturally
- Verify session persistence

## Known Limitations

### Electron
- Webview tag is deprecated in Chromium but still supported in Electron
- Some websites may detect and block webviews
- Requires `webviewTag: true` in webPreferences

### Capacitor
- Webview element must be created dynamically (not in JSX)
- Requires proper lifecycle management
- May need additional permissions in AndroidManifest.xml/Info.plist

## Security Considerations

1. **Process Isolation**: Each webview runs in separate process
2. **Partition**: Using persistent partition for session management
3. **No Node Integration**: Node.js APIs not exposed to webview content
4. **Context Isolation**: Main process and webview are isolated

## Future Enhancements

1. **Navigation Controls**: Back/forward with webview history API
2. **Download Handling**: Intercept and manage downloads
3. **Context Menus**: Custom right-click menus
4. **DevTools**: Integrate Chrome DevTools for debugging
5. **Certificate Handling**: Custom SSL certificate validation
6. **User Scripts**: Inject custom JavaScript into pages

## Troubleshooting

### Webview not loading
- Check `webviewTag: true` in Electron config
- Verify URL is valid and accessible
- Check console for errors

### Black screen in Electron
- Already fixed with hardware acceleration disabled
- Ensure `ready-to-show` event is used

### Capacitor webview not working
- Ensure webview element is created dynamically
- Check browser console for errors
- Verify Capacitor is properly initialized

## Resources

- [Electron WebView Documentation](https://www.electronjs.org/docs/latest/api/webview-tag)
- [Capacitor WebView Plugin](https://capacitorjs.com/docs/apis/browser)
- [WKWebView (iOS)](https://developer.apple.com/documentation/webkit/wkwebview)
- [Android WebView](https://developer.android.com/reference/android/webkit/WebView)
