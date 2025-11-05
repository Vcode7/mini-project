# Lernova Browser - Quick Start Guide

## 🚀 Installation (5 Minutes)

### Step 1: Install MongoDB

**Windows:**
```powershell
# Download and install from: https://www.mongodb.com/try/download/community
# Or use Chocolatey:
choco install mongodb
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Linux:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update && sudo apt-get install -y mongodb-org
sudo systemctl start mongod && sudo systemctl enable mongod
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your API keys:
# - GROQ_API_KEY
# - ELEVENLABS_API_KEY
# - MONGODB_URL (default: mongodb://localhost:27017)
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env:
# VITE_API_URL=http://localhost:8000
```

### Step 4: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run electron:dev
```

---

## ✨ Features Overview

### 1. **AI Assistant**
- Click the chat bubble (bottom right)
- Ask questions about pages
- Summarize content
- Voice commands supported

### 2. **Focus Mode** 🎯
- Click the purple target icon (bottom right)
- Enter your focus topic
- AI blocks irrelevant websites
- Stay productive!

### 3. **Voice Commands** 🎤
- **Tap**: Records for 3-4 seconds (auto-stop)
- **Hold**: Records until you release
- Transcription shows below mic button

### 4. **Tab Management**
- Multiple tabs support
- Drag to reorder (coming soon)
- Tab titles update automatically
- Home page on new tab

---

## 🎯 Using Focus Mode

### Example 1: Study Session
```
Topic: "Python Programming"
Keywords: python, coding, programming
Whitelist: stackoverflow.com, github.com, python.org
```

### Example 2: Research
```
Topic: "Climate Change Research"
Keywords: climate, environment, science
Whitelist: nature.com, sciencedirect.com, arxiv.org
```

### Example 3: Work Project
```
Topic: "React Development"
Keywords: react, javascript, frontend
Whitelist: reactjs.org, npmjs.com, github.com
```

---

## 🔧 Troubleshooting

### MongoDB Not Running
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Backend Won't Start
```bash
# Check Python version (need 3.9+)
python --version

# Reinstall dependencies
pip install -r requirements.txt --upgrade

# Check .env file exists
ls .env
```

### Frontend Issues
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node version (need 18+)
node --version
```

### Audio Not Working
- Grant microphone permissions
- Check browser/Electron audio settings
- Verify ElevenLabs API key

---

## 📚 API Endpoints

### AI Assistant
- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/summarize` - Summarize page

### Voice Commands
- `POST /api/voice/command` - Process voice

### Focus Mode
- `POST /api/focus/start` - Start session
- `POST /api/focus/check-url` - Check URL
- `POST /api/focus/end` - End session

### Data Management
- `GET /api/data/bookmarks` - Get bookmarks
- `POST /api/data/bookmarks` - Add bookmark
- `GET /api/data/history` - Get history
- `GET /api/data/settings` - Get settings

Full docs: http://localhost:8000/docs

---

## 🎨 Keyboard Shortcuts (Coming Soon)

- `Ctrl+T` - New tab
- `Ctrl+W` - Close tab
- `Ctrl+Tab` - Next tab
- `Ctrl+Shift+Tab` - Previous tab
- `Ctrl+L` - Focus address bar
- `Ctrl+R` - Refresh
- `Alt+Left` - Back
- `Alt+Right` - Forward

---

## 💡 Tips & Tricks

### 1. Quick Search
Type directly in address bar - no need to go to Google first

### 2. Voice Commands
Say "Hey AiChat" followed by your question for instant AI help

### 3. Focus Mode Whitelist
Add frequently used domains to avoid interruptions

### 4. Tab Management
Close all tabs to get a fresh home page

### 5. Theme Toggle
Click sun/moon icon to switch between light/dark mode

---

## 📊 System Requirements

### Minimum:
- **OS**: Windows 10, macOS 10.15, Ubuntu 20.04
- **RAM**: 4GB
- **Storage**: 500MB
- **Internet**: Required for AI features

### Recommended:
- **OS**: Windows 11, macOS 13+, Ubuntu 22.04
- **RAM**: 8GB+
- **Storage**: 1GB
- **Internet**: Broadband connection

---

## 🔐 Security & Privacy

- ✅ No data sent to third parties (except AI APIs)
- ✅ Local MongoDB storage
- ✅ API keys stored in .env (never committed)
- ✅ HTTPS enforced for external sites
- ✅ Sandboxed webviews

---

## 📞 Support

### Documentation
- `README.md` - Full documentation
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- `MONGODB_SETUP.md` - Database setup

### API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Issues
- Check existing documentation
- Review error logs
- Open GitHub issue (if applicable)

---

## 🎉 You're Ready!

Lernova is now running. Enjoy focused, AI-powered browsing!

**Next Steps:**
1. ✅ Try Focus Mode with a topic
2. ✅ Ask AI to summarize a page
3. ✅ Use voice commands
4. ✅ Bookmark your favorite sites
5. ✅ Customize settings

---

**Happy Browsing! 🚀**
