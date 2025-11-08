# How to Change Backend URL

## 🎯 Single Source of Truth

The backend URL is configured in **ONE place only**: the `.env` file

## 📝 Steps to Change

1. **Find your computer's IP address:**
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```
   Look for "IPv4 Address" (e.g., `192.168.1.66`)

2. **Edit the `.env` file:**
   ```
   frontend/mobile-app/.env
   ```
   
   Change this line:
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.1.66:5000/api
   ```
   
   To your IP:
   ```env
   EXPO_PUBLIC_API_URL=http://YOUR_IP_HERE:5000/api
   ```

3. **Rebuild the app:**
   ```bash
   cd frontend/mobile-app
   npx expo run:android
   ```

## ⚠️ Important Notes

- **DON'T** edit `src/config/api.js` - it reads from `.env` automatically
- **DON'T** edit `src/utils/backendUrl.js` - deprecated (not used anymore)
- **DON'T** edit `app.json` - no longer contains API URL
- Both your phone and computer must be on the **same WiFi network**
- Make sure backend is running: `cd backend && npm run dev`

## 🔍 Verify Configuration

After rebuilding, check the app logs. You should see:
```
📡 API Base URL: http://YOUR_IP:5000/api
```

If it shows the old IP, clear cache and rebuild:
```bash
npx expo start --clear
# Then rebuild
npx expo run:android
```
