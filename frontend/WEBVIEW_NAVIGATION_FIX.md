# WebView Navigation Tracking - Fix

## Problem
When navigating within the webview (e.g., searching on Google), the URL bar wasn't updating because the webview navigation events weren't being captured and communicated back to React state.

## Solution
Created wrapper components for both Electron and Capacitor webviews that listen to navigation events and update the browser state.

## Changes Made

### 1. ElectronWebView Component (`src/components/ElectronWebView.jsx`)
New component that wraps the Electron webview tag and tracks navigation:

**Events Tracked:**
- `did-navigate` - Main frame navigation (page loads)
- `did-navigate-in-page` - In-page navigation (hash changes, pushState)
- `new-window` - Popup/new window requests (redirects to same webview)
- `did-start-loading` - Loading started
- `did-stop-loading` - Loading completed
- `did-fail-load` - Load errors

**Callback:**
```javascript
onNavigate(tabId, newUrl)
```
Called whenever the webview navigates to update React state.

### 2. CapacitorWebView Component (Updated)
Enhanced the existing component with navigation tracking:

**Events Added:**
- `did-navigate` - Main frame navigation
- `did-navigate-in-page` - In-page navigation

**Same callback pattern** as ElectronWebView for consistency.

### 3. Browser Component (Updated)
Added navigation handler:

```javascript
const handleWebViewNavigate = (tabId, newUrl) => {
  // Update the tab URL and input when webview navigates
  updateTabUrl(tabId, newUrl)
  if (tabId === activeTabId) {
    setUrlInput(newUrl)
  }
}
```

**Updated rendering:**
```jsx
<ElectronWebView
  url={activeTab.url}
  tabId={activeTab.id}
  onNavigate={handleWebViewNavigate}
  ...
/>
```

## How It Works

### Navigation Flow:
1. User searches on Google in webview
2. Webview navigates to search results
3. `did-navigate` or `did-navigate-in-page` event fires
4. Event handler calls `onNavigate(tabId, newUrl)`
5. `handleWebViewNavigate` updates browser state
6. URL bar updates to show new URL
7. Tab state is synchronized

### Event Types:

**did-navigate:**
- Full page navigation
- New page loads
- Form submissions
- Link clicks

**did-navigate-in-page:**
- Hash changes (#section)
- History API (pushState/replaceState)
- Single-page app navigation
- AJAX navigation

## Benefits

✅ **URL bar stays in sync** - Always shows current page URL
✅ **Back/forward tracking** - Can implement history navigation
✅ **Tab state accurate** - Each tab knows its current URL
✅ **Search history** - Can track user's browsing
✅ **Popup handling** - New windows open in same webview

## Testing

### Test URL Updates:
1. Open Google in Electron app
2. Search for something
3. **URL bar should update** to show search results URL
4. Click on a result
5. **URL bar should update** again
6. Use browser back button
7. **URL bar should update** to previous URL

### Test Multiple Tabs:
1. Open multiple tabs
2. Navigate in each tab
3. Switch between tabs
4. Each tab should show correct URL

## Code Example

**Before (No tracking):**
```jsx
<webview src={url} />
// URL bar never updates when navigating
```

**After (With tracking):**
```jsx
<ElectronWebView
  url={url}
  tabId={tabId}
  onNavigate={(id, newUrl) => {
    updateTabUrl(id, newUrl)
    setUrlInput(newUrl)
  }}
/>
// URL bar updates on every navigation ✅
```

## Future Enhancements

1. **Loading indicator** - Show when webview is loading
2. **Progress bar** - Show load progress percentage
3. **Favicon** - Extract and display page favicon
4. **Page title** - Update tab title from page
5. **History API** - Implement back/forward buttons
6. **Download handling** - Intercept downloads
7. **Certificate errors** - Handle SSL errors gracefully

## Files Modified

- `src/components/Browser.jsx` - Added navigation handler
- `src/components/CapacitorWebView.jsx` - Added navigation events

## Files Created

- `src/components/ElectronWebView.jsx` - New wrapper component
- `WEBVIEW_NAVIGATION_FIX.md` - This documentation

## Notes

- Navigation events fire for both user-initiated and programmatic navigation
- In-page navigation (pushState) is tracked separately
- New window requests are redirected to same webview
- Event listeners are properly cleaned up on unmount
- Works for both Electron and Capacitor platforms
