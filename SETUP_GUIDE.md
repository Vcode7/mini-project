# 🚀 Quick Setup Guide - AiChat Browser

## Step-by-Step Installation

### 1️⃣ Get API Keys

#### Groq API Key
1. Visit [https://console.groq.com/](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `gsk_...`)

#### ElevenLabs API Key
1. Visit [https://elevenlabs.io/](https://elevenlabs.io/)
2. Sign up or log in
3. Go to Profile → API Keys
4. Copy your API key

### 2️⃣ Backend Setup (5 minutes)

```bash
# 1. Open terminal in project root
cd backend

# 2. Create Python virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file
copy .env.example .env    # Windows
cp .env.example .env      # macOS/Linux

# 6. Edit .env file and add your API keys
# Use notepad, VS Code, or any text editor
notepad .env              # Windows
nano .env                 # macOS/Linux

# Add these lines:
GROQ_API_KEY=your_groq_key_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here

# 7. Start the backend server
python main.py
```

✅ Backend should now be running at `http://localhost:8000`

### 3️⃣ Frontend Setup (5 minutes)

Open a **NEW terminal** (keep backend running):

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env file
copy .env.example .env    # Windows
cp .env.example .env      # macOS/Linux

# 4. Start development server
npm run dev
```

✅ Frontend should now be running at `http://localhost:5173`

### 4️⃣ Test the Application

1. **Open browser**: Go to `http://localhost:5173`
2. **Test browser**: Enter a URL in the address bar
3. **Test voice**: Click the microphone icon and say "open google"
4. **Test AI**: Click the chat icon and type "Hello AiChat"

## 🎯 Quick Test Commands

### Voice Commands to Try:
- "Open Google"
- "Go back"
- "New tab"
- "Hey AiChat, what can you do?"

### Chat Commands to Try:
- "Hello!"
- "Summarize this page" (click the button)
- "What is this website about?"

## 🔧 Common Issues & Fixes

### Issue: "Module not found" errors

**Solution**:
```bash
# Backend
cd backend
pip install -r requirements.txt --upgrade

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: "API key invalid"

**Solution**:
1. Check `.env` file has correct keys
2. No spaces around `=` sign
3. No quotes around keys
4. Restart backend server after changing `.env`

### Issue: Microphone not working

**Solution**:
1. Grant microphone permissions in browser
2. Use `localhost` or HTTPS (required for mic access)
3. Check browser console for errors

### Issue: CORS errors

**Solution**:
1. Ensure backend is running on port 8000
2. Check `CORS_ORIGINS` in `backend/.env`
3. Restart both servers

### Issue: Port already in use

**Solution**:
```bash
# Windows - Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

## 📱 Building Desktop App

### Windows .exe

```bash
cd frontend
npm run build
npm run electron:build
```

Output: `frontend/dist-electron/AiChat Browser Setup.exe`

### macOS .dmg

```bash
cd frontend
npm run build
npm run electron:build
```

Output: `frontend/dist-electron/AiChat Browser.dmg`

## 📱 Building Mobile App

### Android APK

**Prerequisites**:
- Android Studio installed
- Java JDK 11+

**Steps**:
```bash
cd frontend

# First time only
npm run capacitor:init
npm run capacitor:add:android

# Every build
npm run build
npm run capacitor:sync
npm run capacitor:open:android
```

In Android Studio:
1. Wait for Gradle sync
2. Build → Build Bundle(s) / APK(s) → Build APK(s)
3. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### iOS App

**Prerequisites**:
- macOS with Xcode
- Apple Developer account

**Steps**:
```bash
cd frontend

# First time only
npm run capacitor:add:ios

# Every build
npm run build
npm run capacitor:sync
npm run capacitor:open:ios
```

In Xcode:
1. Select your team
2. Product → Archive
3. Distribute App

## 🎨 Customization Tips

### Change Theme Colors

Edit `frontend/src/index.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Blue */
  /* Change to your color */
}
```

### Change AI Voice

Edit `backend/.env`:
```env
# Browse voices at elevenlabs.io
ELEVENLABS_VOICE_ID=your_voice_id
```

### Change AI Model

Edit `backend/.env`:
```env
# Options: mixtral-8x7b-32768, llama2-70b-4096, etc.
GROQ_MODEL=mixtral-8x7b-32768
```

## 📊 System Requirements

### Development:
- **OS**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Internet**: Required for AI APIs

### Production:
- **Web**: Any modern browser
- **Desktop**: Windows 7+, macOS 10.12+, Linux
- **Mobile**: Android 7.0+, iOS 12.0+

## 🔐 Security Checklist

- [ ] API keys in `.env` files (not in code)
- [ ] `.env` files in `.gitignore`
- [ ] HTTPS in production
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] CORS properly configured

## 📚 Next Steps

1. ✅ Complete setup
2. 🧪 Test all features
3. 🎨 Customize appearance
4. 📦 Build for your platform
5. 🚀 Deploy to production

## 🆘 Need Help?

1. Check `README.md` for detailed docs
2. Review error messages carefully
3. Check browser console (F12)
4. Verify API keys are valid
5. Ensure all services are running

## 🎉 You're Ready!

Your AiChat Browser is now set up and running. Enjoy browsing with AI superpowers! 🚀
