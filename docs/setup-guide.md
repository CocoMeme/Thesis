# Gourd Classification Mobile App - Setup Guide

This guide will walk you through setting up the entire Gourd Classification project, including the React Native mobile app, Node.js backend, and ML model training environment.

---

## Prerequisites

Before starting, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v16.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **MongoDB** (Community Edition) - [Download here](https://www.mongodb.com/try/download/community)

### For React Native Development
- **React Native CLI**: `npm install -g @react-native-community/cli`
- **Android Studio** (for Android development) - [Download here](https://developer.android.com/studio)
- **Xcode** (for iOS development, macOS only) - Available on Mac App Store
- **Java Development Kit (JDK)** 11 or higher

### For ML Model Training
- **Anaconda** or **Miniconda** - [Download here](https://www.anaconda.com/products/distribution)
- **CUDA Toolkit** (if using GPU) - [Download here](https://developer.nvidia.com/cuda-downloads)

---

## Project Structure Setup

### 1. Create Main Project Directory
```powershell
# Navigate to your desired location
cd "C:\Users\coand\Desktop\Thesis"

# Create the main project structure
mkdir thesis-app
cd thesis-app
```

### 2. Initialize Git Repository
```powershell
git init
# Create .gitignore file (see section below)
```

---

## 📱 Frontend Setup (React Native)

### 1. Create React Native Project
```powershell
# From thesis-app directory
npx react-native init frontend
cd frontend
```

### 2. Install Required Dependencies
```powershell
# Core navigation and UI libraries
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated

# Camera and image handling
npm install react-native-vision-camera
npm install react-native-image-picker
npm install react-native-image-resizer

# TensorFlow Lite for on-device ML
npm install @tensorflow/tfjs @tensorflow/tfjs-react-native
npm install @tensorflow/tfjs-platform-react-native

# HTTP client and storage
npm install axios
npm install @react-native-async-storage/async-storage

# UI components
npm install react-native-vector-icons
npm install react-native-elements
```

### 3. iOS Setup (macOS only)
```powershell
cd ios
pod install
cd ..
```

### 4. Create Project Structure
```powershell
# Create the folder structure
mkdir src
mkdir src\components src\screens src\navigation src\hooks src\services src\assets src\styles src\ml
```

---

## 🖥️ Backend Setup (Node.js + Express)

### 1. Create Backend Directory and Initialize
```powershell
# From thesis-app directory
mkdir backend
cd backend
npm init -y
```

### 2. Install Backend Dependencies
```powershell
# Core Express framework
npm install express cors helmet morgan
npm install dotenv

# Database
npm install mongoose

# File upload handling
npm install multer
npm install cloudinary  # For cloud image storage

# Authentication
npm install jsonwebtoken bcryptjs

# Validation and utilities
npm install joi
npm install express-validator

# Development dependencies
npm install --save-dev nodemon concurrently
```

### 3. Create Backend Structure
```powershell
mkdir src config uploads
mkdir src\controllers src\models src\routes src\services src\utils
```

### 4. Setup Package.json Scripts
Add the following to your `backend/package.json`:
```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

---

## ML Models Setup (Python Environment)

### 1. Create ML Environment
```powershell
# From thesis-app directory
mkdir ml-models
cd ml-models

# Create conda environment
conda create -n gourd-ml python=3.9
conda activate gourd-ml
```

### 2. Install Python Dependencies
```powershell
# Create requirements.txt file first (see content below)
pip install -r requirements.txt
```

**Create `ml-models/requirements.txt`:**
```
torch>=1.12.0
torchvision>=0.13.0
ultralytics>=8.0.0
opencv-python>=4.6.0
numpy>=1.21.0
pandas>=1.4.0
matplotlib>=3.5.0
seaborn>=0.11.0
scikit-learn>=1.1.0
tensorflow>=2.10.0
jupyterlab>=3.4.0
pillow>=9.0.0
albumentations>=1.2.0
tqdm>=4.64.0
```

### 3. Create ML Directory Structure
```powershell
mkdir notebooks datasets yolov8-training harvest-prediction exports
```

---

## Database Setup (MongoDB)

### 1. Start MongoDB Service
```powershell
# Start MongoDB (Windows)
net start MongoDB

# Or if installed via installer, it should start automatically
# Check if running:
mongosh --eval "db.adminCommand('ismaster')"
```

### 2. Create Database and Initial Collections
```javascript
// Connect to MongoDB
mongosh

// Create database
use gourd_classification_db

// Create collections
db.createCollection("users")
db.createCollection("scans")
db.createCollection("gourd_data")

// Exit MongoDB shell
exit
```

---

## Environment Configuration

### 1. Backend Environment Variables
Create `backend/.env` file:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gourd_classification_db
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 2. Frontend Environment Configuration
Create `frontend/.env` file:
```env
API_BASE_URL=http://localhost:3000/api
ENVIRONMENT=development
```

---

## Development Workflow

### 1. Start Backend Server
```powershell
cd backend
npm run dev
```

### 2. Start React Native Metro Bundler
```powershell
# New terminal window
cd frontend
npx react-native start
```

### 3. Run on Device/Emulator
```powershell
# Android
npx react-native run-android

# iOS (macOS only)
npx react-native run-ios
```

### 4. Activate ML Environment for Model Training
```powershell
conda activate gourd-ml
cd ml-models
jupyter lab
```

---

## Essential Files to Create

### 1. Root .gitignore
Create `thesis-app/.gitignore`:
```
# Dependencies
node_modules/
*.log

# Environment variables
.env
.env.local

# Build outputs
build/
dist/

# ML Models (large files)
*.pth
*.pt
*.tflite
*.onnx

# Datasets (large files)
datasets/raw/
datasets/processed/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Python
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
*.egg-info/

# Jupyter
.ipynb_checkpoints/
```

### 2. Backend Basic Server File
Create `backend/src/app.js`:
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Gourd Classification API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

---

## Testing the Setup

### 1. Verify Backend
```powershell
cd backend
npm run dev
# Visit http://localhost:3000 in browser
```

### 2. Verify Frontend
```powershell
cd frontend
npx react-native start
# Run on emulator/device
```

### 3. Verify ML Environment
```powershell
conda activate gourd-ml
python -c "import torch; print('PyTorch version:', torch.__version__)"
python -c "import cv2; print('OpenCV version:', cv2.__version__)"
```

---

## Common Issues & Troubleshooting

### React Native Issues
- **Metro bundler port conflict**: Use `npx react-native start --reset-cache`
- **Android build errors**: Clean project with `cd android && ./gradlew clean`
- **iOS build errors**: Clean build folder in Xcode

### Backend Issues
- **MongoDB connection**: Ensure MongoDB service is running
- **Port already in use**: Change PORT in .env file

### ML Environment Issues
- **CUDA not detected**: Verify CUDA installation and compatibility
- **Package conflicts**: Use conda instead of pip for conflicting packages

---

## Next Steps

1. **Implement Core Components**: Start with basic UI components and camera integration
2. **Create ML Models**: Begin with YOLOv8 training for gourd detection
3. **Develop API Endpoints**: Implement authentication, image upload, and prediction APIs
4. **Mobile App Integration**: Connect frontend with backend APIs
5. **Model Deployment**: Convert trained models to TensorFlow Lite format

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the architecture.md for system overview
3. Consult the individual component documentation
