# EGourd Application Setup Guide

This guide will help you set up and run the EGourd application on your local machine and Android device.

---

## Prerequisites

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **Android Studio** (for USB development) - [Download here](https://developer.android.com/studio)
3. **Git** - [Download here](https://git-scm.com/)
4. **Android device** with USB debugging enabled

---

## 1. Installation

### Clone the Repository

```bash
git clone https://github.com/CocoMeme/Thesis.git
cd Thesis
```

### Backend Setup

```bash
cd backend
npm install
```

**Environment Variables:**
- Create a `.env` file in the `backend` folder
- Paste the `.env` content that will be sent via Messenger

### Frontend Setup

```bash
cd ../frontend/mobile-app
npm install
```

---

## 2. Running the Application

### Option A: USB Development (Recommended for Active Development)

This method allows hot reload and live development.

#### Step 1: Prepare Your Android Device

1. Enable **Developer Options**:
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times

2. Enable **USB Debugging**:
   - Go to Settings > Developer Options
   - Turn on "USB Debugging"
   
3. Connect your device to your computer via USB

4. Verify connection:
   ```bash
   adb devices
   ```
   You should see your device listed.

#### Step 2: Configure Android SDK Path

Create `frontend/mobile-app/android/local.properties` file:

```properties
sdk.dir=C\:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
```

Replace `YOUR_USERNAME` with your Windows username.

**Or** run this command to auto-generate:
```bash
cd frontend/mobile-app
npx expo prebuild --clean
```

#### Step 3: Get Your Computer's IP Address

```bash
ipconfig
```

Look for "IPv4 Address" under your active network adapter (e.g., `192.168.1.66`).

#### Step 4: Update Backend URL

Edit `frontend/mobile-app/src/utils/backendUrl.js`:

```javascript
const DEV_URL = 'http://YOUR_IP_ADDRESS:5000/api';
const PROD_URL = 'http://YOUR_IP_ADDRESS:5000/api';
```

Replace `YOUR_IP_ADDRESS` with the IP from Step 3.

#### Step 5: Start Backend Server

Open a terminal:
```bash
cd backend
npm run dev
```

Keep this terminal running.

#### Step 6: Build and Install App

Open a new terminal:
```bash
cd frontend/mobile-app
npx expo run:android
```

This will:
- Build the app
- Install it on your connected device
- Start the Metro bundler

**First build takes 5-10 minutes. Subsequent builds are faster.**

#### Step 7: Development Workflow

After the initial build:
- Make code changes in your editor
- Save the file
- The app will reload automatically on your device

To restart Metro bundler:
```bash
cd frontend/mobile-app
npx expo start --dev-client
```

---

### Option B: EAS Build (For Testing Without USB)

This method creates a standalone APK that can be shared and installed on multiple devices.

#### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

#### Step 2: Login to Expo

```bash
eas login
```

#### Step 3: Build APK

```bash
cd frontend/mobile-app
eas build --platform android --profile preview
```

This will:
- Upload your project to EAS servers
- Build the APK in the cloud (takes 10-15 minutes)
- Provide a download link

#### Step 4: Install APK

1. Download the APK from the provided link
2. Transfer to your Android device
3. Install the APK (enable "Install from Unknown Sources" if prompted)

#### Step 5: Run Backend Server

```bash
cd backend
npm run dev
```

#### Step 6: Open the App

- Launch EGourd app on your device
- The app will connect to your backend at the configured IP address

**Note:** Your device must be on the same WiFi network as your computer.

---

## 3. Environment Variables Setup

The `.env` file for the backend contains sensitive configuration including:
- Database credentials
- API keys
- Email service configuration
- Cloudinary credentials

**Steps:**
1. Wait for the `.env` file content to be sent via Messenger
2. Create a new file: `backend/.env`
3. Paste the content into this file
4. Save the file

**Never commit the `.env` file to version control.**

---

## Troubleshooting

### "Failed to connect to localhost"

- Ensure your device and computer are on the same WiFi network
- Verify your IP address hasn't changed (re-run `ipconfig`)
- Update the IP in `backendUrl.js` if needed

### "SDK location not found"

- Create `android/local.properties` with your Android SDK path
- Or run `npx expo prebuild --clean`

### Device Not Detected (adb devices shows nothing)

- Check USB cable connection
- Enable USB debugging on device
- Try a different USB port
- Install device drivers if needed

### Build Failed

- Delete `node_modules` and run `npm install` again
- Clear Gradle cache: `cd android && ./gradlew clean`
- Run `npx expo prebuild --clean`

---

## Network Requirements

- **Same WiFi Network:** Your device and computer must be on the same network
- **Firewall:** Ensure Windows Firewall allows Metro bundler (port 8081)
- **Backend Port:** Default is 5000, ensure it's not blocked

---

## Quick Reference Commands

```bash
# Backend
cd backend
npm run dev              # Start backend server

# Frontend
cd frontend/mobile-app
npm install              # Install dependencies
npx expo prebuild --clean   # Rebuild native code
npx expo run:android     # Build and install via USB
npx expo start --dev-client  # Start Metro bundler
eas build --platform android --profile preview  # Cloud build

# Utilities
ipconfig                 # Get your IP address
adb devices              # Check connected devices
```

---

## Additional Notes

- **Backend URL:** Must use computer's IP address, not `localhost`
- **Metro Bundler:** Runs on port 8081
- **Backend Server:** Runs on port 5000
- **First Build:** Takes longer due to dependency downloads
- **Hot Reload:** Only works with development builds via USB