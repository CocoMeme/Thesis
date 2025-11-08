# EGourd Application Setup Guide


## NOTE

- Connect your Android device using USB to your computer, then turn on USB debugging on your mobile device.
- Both your computer and Android device must be on the same WiFi network.
- If you change your computer's IP address, update the `.env` file accordingly.

---

## SETUP STEPS

### A. Install Dependencies

**Backend:**

cd backend
npm install

Create a `.env` file in the `backend` folder (content will be provided separately).

**Frontend:**

cd frontend/mobile-app
npm install

---

### B. Prepare Your Android Device

1. **Enable Developer Options:**
   - Settings > About Phone > Tap "Build Number" 7 times

2. **Enable USB Debugging:**
   - Settings > Developer Options > Turn on "USB Debugging"

3. **Connect via USB and verify:**
   
   adb devices
   
   You should see your device listed.

---

### C. Configure Backend URL

**IMPORTANT:** You must update the backend URL to match your computer's IP address.

1. **Find your IP address:**
   
   ipconfig
   
   Look for "IPv4 Address" (e.g., `192.168.1.66`)

2. **Edit `frontend/mobile-app/.env` file:**
   
   EXPO_PUBLIC_API_URL=http://YOUR_IP_ADDRESS:5000/api
   
   Replace `YOUR_IP_ADDRESS` with your actual IP from step 1.
   
   **Example:**
   
   EXPO_PUBLIC_API_URL=http://192.168.1.66:5000/api

---

### D. Run the Application

**Step 1: Start Backend Server (Terminal 1)**

cd backend
npm run dev

Keep this terminal running. You should see: `🚀 Server running on port 5000`

**Step 2: Build and Run App (Terminal 2)**

cd frontend/mobile-app
npx expo run:android

This will:
- Build the app (first build takes 5-10 minutes)
- Install it on your connected device
- Start Metro bundler

---

## After First Build

Once the app is installed, you can use the faster development workflow:

1. **Start backend** (if not running):
   cd backend
   npm run dev

2. **Start Metro bundler**:
   cd frontend/mobile-app
   npx expo start --dev-client

3. **Open the app** on your device
The app will hot-reload automatically when you save code changes!

---

## When Your IP Address Changes
If you change WiFi networks or your IP address changes:
1. **Find new IP:**
   ipconfig

2. **Update `frontend/mobile-app/.env`:**
   EXPO_PUBLIC_API_URL=http://NEW_IP_ADDRESS:5000/api

3. **Rebuild the app:**
   cd frontend/mobile-app
   npx expo run:android

---

## Troubleshooting
### Network Error / Can't Connect to Backend
**Problem:** App shows "Network Error" or can't fetch data
**Solution:**
1. Check both devices are on the **same WiFi network**
2. Verify IP address is correct in `.env` file
3. Make sure backend server is running (`npm run dev`)
4. Rebuild the app: `npx expo run:android`

---

### Device Not Detected
**Problem:** `adb devices` shows nothing
**Solution:**
- Check USB cable connection
- Enable USB debugging on your device
- Try a different USB port
- Accept "Allow USB debugging" prompt on your phone

---

### Build Fails
**Problem:** Build errors or crashes
**Solution:**

cd frontend/mobile-app
rm -rf node_modules
npm install
npx expo run:android

---

### Port Already in Use
**Problem:** "Port 8081 is already in use"
**Solution:**
- Close other Metro bundler instances
- Or accept using a different port when prompted

---

## Important Notes

✅ **Both devices must be on the same WiFi network**  
✅ **Backend must be running before opening the app**  
✅ **Use your computer's IP address, not `localhost`**  
✅ **First build takes 5-10 minutes**  
✅ **Update `.env` file whenever your IP changes**  

---

## Need Help?

- Check that backend shows: `🚀 Server running on port 5000`
- Check that app logs show: `📡 API Base URL: http://YOUR_IP:5000/api`
- Verify your IP hasn't changed: `ipconfig`