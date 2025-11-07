# Testing Checklist - Browser App

## ✅ Fixed Issues

### 1. AI Chat Box Resizing
**Issue**: Resize handles not working properly
**Fix**: Removed unnecessary dependencies from useEffect that were causing re-registration of event listeners
**Status**: ✅ FIXED

### 2. Bottom Bar Platform Detection
**Issue**: Need to ensure bottom bar only shows on Capacitor, not Electron
**Fix**: Already correctly implemented with `isCapacitor()` check
**Status**: ✅ VERIFIED

## Desktop Testing (Electron & Web)

### AI Chat Box Resizing
- [ ] Open AI chat box
- [ ] Hover over top-left corner - should see grip icon and cursor change
- [ ] Click and drag corner to resize both width and height
- [ ] Hover over left edge - cursor should change to resize horizontal
- [ ] Click and drag left edge to resize width only
- [ ] Hover over top edge - cursor should change to resize vertical
- [ ] Click and drag top edge to resize height only
- [ ] Verify minimum size: 320px width, 400px height
- [ ] Verify maximum size: 800px width, 900px height
- [ ] Resize handles should have visible background on hover

### Website Suggestions
- [ ] Ask "teach me Python" or "learn React"
- [ ] Verify website suggestions appear at bottom of chat
- [ ] Click left arrow to navigate to previous suggestion
- [ ] Click right arrow to navigate to next suggestion
- [ ] Click external link icon to visit website
- [ ] Verify website opens in browser tab
- [ ] Test with different topics:
  - [ ] Programming: "learn JavaScript"
  - [ ] Science: "learn physics"
  - [ ] Languages: "learn Spanish"
  - [ ] General: "learn about history"

### Navigation Bar (Desktop)
- [ ] All buttons visible: Back, Forward, Refresh, Home
- [ ] URL/search bar full width
- [ ] Theme toggle button visible
- [ ] Voice recorder button visible
- [ ] Downloads button visible
- [ ] Highlight button visible
- [ ] Settings button visible
- [ ] User menu visible

### Bottom Bar (Desktop)
- [ ] **IMPORTANT**: Bottom bar should NOT be visible on desktop
- [ ] Verify on Electron app
- [ ] Verify on web browser

## Mobile Testing (Capacitor - Android/iOS)

### Build & Deploy
```bash
cd frontend
npm run build
npx cap sync android
npx cap open android
```

### AI Chat Box (Mobile)
- [ ] Open AI chat box
- [ ] Verify it's positioned above bottom bar
- [ ] Verify it's full width (minus small margins)
- [ ] Verify resize handles are NOT visible on mobile
- [ ] Chat should be responsive and scrollable

### Website Suggestions (Mobile)
- [ ] Ask learning-related question
- [ ] Verify suggestions appear
- [ ] Navigate with arrow buttons (touch-friendly)
- [ ] Click external link to visit website
- [ ] Website should open in app's webview

### Bottom Navigation Bar (Mobile)
- [ ] **IMPORTANT**: Bottom bar SHOULD be visible on Capacitor
- [ ] Verify 5 icons are visible: Home, Highlight, Voice, Downloads, Settings
- [ ] Tap Home icon - should navigate to home page
- [ ] Tap Highlight icon - should open highlight modal
- [ ] Tap Voice icon - should toggle voice commands
- [ ] Verify red dot appears on Voice icon when active
- [ ] Tap Downloads icon - should open downloads modal
- [ ] Tap Settings icon - should open settings modal
- [ ] Verify active state highlighting works
- [ ] Verify safe area padding at bottom (for notched devices)

### Navigation Bar (Mobile)
- [ ] Back button visible and working
- [ ] Forward button visible and working
- [ ] Refresh button visible and working
- [ ] Home button hidden (moved to bottom bar)
- [ ] URL/search bar responsive (smaller padding)
- [ ] Theme toggle visible
- [ ] Voice, Downloads, Highlight, Settings hidden (moved to bottom bar)

### Responsive Layout
- [ ] App fills entire screen
- [ ] No horizontal scrolling
- [ ] Bottom bar stays at bottom
- [ ] AI chat positioned correctly above bottom bar
- [ ] Modals are full-screen on mobile
- [ ] All touch targets are at least 44x44px

## Cross-Platform Verification

### Platform Detection
- [ ] **Web Browser**: Shows download page (no app features)
- [ ] **Electron**: Full desktop UI, NO bottom bar, resizable chat
- [ ] **Capacitor**: Mobile UI, WITH bottom bar, non-resizable chat

### Theme Switching
- [ ] Toggle theme on desktop
- [ ] Toggle theme on mobile
- [ ] Verify all components respect theme
- [ ] Verify bottom bar respects theme colors

### Voice Commands
- [ ] Test voice recording on desktop
- [ ] Test voice recording on mobile
- [ ] Verify red indicator shows when active
- [ ] Verify transcription works

## Backend Integration

### Website Suggestions API
- [ ] Verify backend returns `suggested_websites` field
- [ ] Test with different query types
- [ ] Verify 5 websites returned
- [ ] Check website data structure: `{title, description, url}`

### AI Chat API
- [ ] Verify chat responses work
- [ ] Verify audio responses work
- [ ] Verify page summarization works
- [ ] Verify context is sent correctly

## Performance Testing

### Desktop
- [ ] Resize chat box smoothly (no lag)
- [ ] Navigate between website suggestions quickly
- [ ] No memory leaks during resize operations

### Mobile
- [ ] Bottom bar animations smooth
- [ ] Touch interactions responsive
- [ ] No lag when switching tabs in bottom bar
- [ ] App doesn't crash on orientation change

## Edge Cases

### AI Chat Resizing
- [ ] Resize to minimum size and verify it stops
- [ ] Resize to maximum size and verify it stops
- [ ] Resize while chat is receiving messages
- [ ] Close and reopen chat - size should reset to default

### Website Suggestions
- [ ] Ask non-learning question - no suggestions should appear
- [ ] Navigate to last suggestion - forward button disabled
- [ ] Navigate to first suggestion - back button disabled
- [ ] Close chat with suggestions - should clear on reopen

### Bottom Bar
- [ ] Switch between all 5 features rapidly
- [ ] Open modal from bottom bar, close it, open another
- [ ] Test with keyboard visible (on mobile)
- [ ] Test with device in landscape mode

## Known Issues & Limitations

1. ✅ **Resize handles**: Only available on desktop (by design)
2. ✅ **Bottom bar**: Only on Capacitor (by design)
3. ✅ **Website suggestions**: Uses predefined list (future: AI-generated)
4. ⚠️ **Orientation**: May need adjustment for landscape mode on mobile

## Success Criteria

- ✅ AI chat box resizes smoothly on desktop
- ✅ Bottom bar only appears on Capacitor (mobile)
- ✅ Website suggestions work and are navigable
- ✅ All platform-specific features work correctly
- ✅ No console errors
- ✅ Responsive on all screen sizes
- ✅ Build and sync complete successfully

## Quick Test Commands

```bash
# Desktop (Electron)
cd frontend
npm run electron:dev

# Web Browser
cd frontend
npm run dev
# Open http://localhost:5173

# Mobile (Capacitor)
cd frontend
npm run build
npx cap sync android
npx cap open android

# Backend
cd backend
python -m uvicorn main:app --reload
```

## Debugging Tips

### If resize doesn't work:
1. Check browser console for errors
2. Verify `isCapacitor()` returns false on desktop
3. Check if resize handles are visible (hover over edges)
4. Verify mouse events are firing (add console.log in startResize)

### If bottom bar shows on Electron:
1. Check `window.Capacitor` is undefined in Electron
2. Verify `isCapacitor()` function in platform.js
3. Check browser console for platform detection

### If website suggestions don't appear:
1. Check backend is running
2. Verify API response includes `suggested_websites`
3. Check console for API errors
4. Verify query contains learning keywords

## Report Issues

If you find any issues:
1. Note the platform (Web/Electron/Capacitor)
2. Note the browser/OS version
3. Provide steps to reproduce
4. Include console errors if any
5. Take screenshots if helpful
