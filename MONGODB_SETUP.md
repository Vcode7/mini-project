# MongoDB Setup Guide for Lernova

## Installation

### Windows

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Download the MSI installer for Windows
   - Run the installer and follow the setup wizard

2. **Install as a Service**
   - During installation, select "Install MongoDB as a Service"
   - Keep the default data directory: `C:\Program Files\MongoDB\Server\7.0\data`

3. **Verify Installation**
   ```powershell
   mongod --version
   ```

### macOS

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0
```

### Linux (Ubuntu/Debian)

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Configuration

### 1. Update Backend .env

Add these lines to `backend/.env`:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=lernova_db
```

### 2. Install Python Dependencies

```bash
cd backend
pip install motor pymongo dnspython
```

Or reinstall all:

```bash
pip install -r requirements.txt
```

## Database Structure

Lernova uses the following collections:

### 1. **bookmarks**
- Stores user bookmarks
- Fields: url, title, favicon, folder, tags, created_at

### 2. **history**
- Browsing history
- Fields: url, title, visited_at, visit_count

### 3. **settings**
- User preferences and settings
- Fields: theme, search_engine, ai_settings, focus_mode_settings

### 4. **focus_sessions**
- Focus mode session data
- Fields: topic, keywords, allowed_domains, stats

## Verify Setup

### 1. Check MongoDB is Running

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl status mongod
```

### 2. Connect to MongoDB Shell

```bash
mongosh
```

### 3. Check Lernova Database

```javascript
use lernova_db
show collections
db.settings.find()
```

## MongoDB Compass (GUI Tool)

1. **Download**: https://www.mongodb.com/try/download/compass
2. **Connect**: `mongodb://localhost:27017`
3. **Browse**: Navigate to `lernova_db` database

## Troubleshooting

### MongoDB Won't Start

**Windows:**
```powershell
# Check service status
Get-Service MongoDB

# Restart service
Restart-Service MongoDB
```

**macOS/Linux:**
```bash
# Check logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart
sudo systemctl restart mongod
```

### Connection Errors

1. **Check MongoDB is running**
2. **Verify port 27017 is not blocked**
3. **Check .env configuration**

### Permission Issues

```bash
# Linux - Fix data directory permissions
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown mongodb:mongodb /tmp/mongodb-27017.sock
```

## Cloud MongoDB (Optional)

### Using MongoDB Atlas (Free Tier)

1. **Create Account**: https://www.mongodb.com/cloud/atlas/register
2. **Create Cluster**: Choose free tier (M0)
3. **Get Connection String**
4. **Update .env**:
   ```env
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/lernova_db?retryWrites=true&w=majority
   ```

## Backup & Restore

### Backup

```bash
mongodump --db lernova_db --out ./backup
```

### Restore

```bash
mongorestore --db lernova_db ./backup/lernova_db
```

## Performance Tips

1. **Indexes are auto-created** on first run
2. **Monitor with**: `db.stats()`
3. **Clear old history**: Use the API endpoint `/api/data/history` (DELETE)

## Security (Production)

1. **Enable Authentication**:
   ```bash
   mongod --auth
   ```

2. **Create Admin User**:
   ```javascript
   use admin
   db.createUser({
     user: "admin",
     pwd: "secure_password",
     roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase"]
   })
   ```

3. **Update Connection String**:
   ```env
   MONGODB_URL=mongodb://admin:secure_password@localhost:27017/lernova_db?authSource=admin
   ```

## Next Steps

1. ✅ MongoDB installed and running
2. ✅ Backend dependencies installed
3. ✅ .env configured
4. ▶️ Start backend: `python main.py`
5. ▶️ Test API: http://localhost:8000/docs

---

**Need Help?** Check MongoDB docs: https://docs.mongodb.com/
