# Testing Instructions

## Prerequisites

1. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # On Windows
   pip install -r requirements.txt
   python main.py
   ```
   Backend should run on http://localhost:8000

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ```

## Testing the Fixes

### 1. Test Search Engine Switching

**Steps**:
1. Start the Electron app:
   ```bash
   npm run electron:dev
   ```

2. Click the Settings icon (gear) in the top toolbar

3. In the "General" tab, change "Default Search Engine" to "DuckDuckGo"

4. Click "Save Changes"

5. Type "test query" in the URL bar and press Enter

6. **Expected Result**: Should search using DuckDuckGo instead of Google

7. Test with other search engines: Bing, Brave, Ecosia

**Verification**: Check the URL that loads - it should match the selected search engine's search URL format.

---

### 2. Test Capacitor WebView (Mobile)

**Steps**:
1. Build for Capacitor:
   ```bash
   npm run build
   npm run capacitor:sync
   ```

2. Open in Android Studio:
   ```bash
   npm run capacitor:open:android
   ```

3. Run the app on an emulator or device

4. Try navigating to various websites:
   - https://google.com
   - https://github.com
   - https://wikipedia.org

5. **Expected Result**: Websites should load correctly in the iframe-based webview

**Verification**: Pages should display without errors. Navigation should work.

---

### 3. Test Downloads

**Steps**:
1. Start Electron app:
   ```bash
   npm run electron:dev
   ```

2. Navigate to a website with downloadable files (e.g., https://file-examples.com)

3. Click to download a file

4. File dialog should appear - choose a save location

5. Click the Downloads icon (down arrow) in the toolbar

6. **Expected Result**: Should see the download progress and status

**Verification**: 
- Download appears in the Downloads modal
- Progress bar updates in real-time
- Status changes to "completed" when done
- Download is saved in MongoDB (check with MongoDB Compass)

---

### 4. Test Chrome Extension Support

**Preparation - Get a Test Extension**:
1. Download React Developer Tools as unpacked:
   - Visit Chrome Web Store
   - Right-click on React Developer Tools → "Inspect"
   - In DevTools, go to Application → Service Workers
   - OR manually download extension files

2. **Easier method**: Create a simple test extension:
   
   Create a folder `test-extension` with these files:
   
   **manifest.json**:
   ```json
   {
     "manifest_version": 3,
     "name": "Test Extension",
     "version": "1.0.0",
     "description": "A simple test extension",
     "action": {
       "default_popup": "popup.html",
       "default_icon": {
         "16": "icon.png",
         "48": "icon.png",
         "128": "icon.png"
       }
     },
     "permissions": []
   }
   ```
   
   **popup.html**:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <style>
       body { width: 200px; padding: 10px; }
       h1 { font-size: 16px; }
     </style>
   </head>
   <body>
     <h1>Test Extension</h1>
     <p>This is working!</p>
   </body>
   </html>
   ```
   
   **icon.png**: Any 128x128 PNG image

**Testing Steps**:

1. Start Electron app:
   ```bash
   npm run electron:dev
   ```

2. Click the puzzle piece icon (Extensions) in the toolbar

3. Click "Install Extension"

4. Select the test extension folder you created

5. **Expected Result**: Extension appears in the list with:
   - Name: "Test Extension"
   - Version: "1.0.0"
   - Description: "A simple test extension"
   - Toggle switch (green = enabled)

6. Test toggle functionality:
   - Click the toggle to disable
   - Toggle should turn gray
   - Click again to enable
   - Toggle should turn green

7. Test removal:
   - Click the trash icon
   - Confirm removal
   - Extension should disappear from list

**Verification**: 
- Extension loads without errors
- Can be toggled on/off
- Can be removed
- Extension icon may appear in Chrome extensions area (depending on extension type)

---

## Testing Backend Status

### Verify Backend Routes

1. **Test API Health**:
   ```bash
   curl http://localhost:8000/health
   ```
   Expected: `{"status":"healthy"}`

2. **Test Settings Endpoint**:
   ```bash
   curl http://localhost:8000/api/data/settings
   ```
   Expected: JSON with default settings

3. **Test Downloads Endpoint**:
   ```bash
   curl http://localhost:8000/api/downloads
   ```
   Expected: `{"success":true,"downloads":[]}`

4. **Verify MongoDB Connection**:
   - Open MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - Check `lernova_db` database
   - Should see collections: bookmarks, history, settings, focus_sessions, downloads

---

## Troubleshooting

### Issue: Search engine not changing
- **Solution**: Make sure to click "Save Changes" in Settings
- Clear browser cache if in web mode
- Check console for errors

### Issue: Capacitor app not loading websites
- **Solution**: 
  - Check that iframe sandbox attributes are correct
  - Verify network connectivity
  - Check Android permissions in AndroidManifest.xml

### Issue: Downloads not appearing
- **Solution**:
  - Verify backend is running on port 8000
  - Check MongoDB connection
  - Look at Electron console for errors
  - Verify axios is properly configured with API_URL

### Issue: Extensions not loading
- **Solution**:
  - Ensure extension has valid manifest.json
  - Check extension is unpacked (not .crx file)
  - Look at Electron console for extension errors
  - Verify extension is Manifest V2 or V3
  - Try with the simple test extension first

### Issue: "Extension management not available"
- **Solution**: Extensions only work in Electron desktop app, not in Capacitor or web mode

---

## Success Criteria

✅ All Tests Pass When:
1. Search engine changes immediately after saving settings
2. Capacitor app loads websites in iframe without errors
3. Downloads appear in Downloads modal with progress tracking
4. Extensions can be installed, toggled, and removed successfully
5. No console errors appear during testing
6. Backend responds to all API requests correctly

---

## Additional Notes

- Always test in both light and dark themes
- Test with different screen sizes (responsive design)
- Check that all icons and UI elements render correctly
- Verify that modals can be opened and closed properly
- Test navigation back/forward buttons work correctly
- Verify focus mode still works after changes
