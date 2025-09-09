thesis/
│
├── frontend/                     # React Native mobile app
│   ├── src/
│   │   ├── components/           # Reusable UI components (buttons, cards, modals)
│   │   ├── screens/              # App screens (Home, Camera, Results, History, etc.)
│   │   ├── navigation/           # Navigation setup (React Navigation)
│   │   ├── hooks/                # Custom hooks (useCamera, usePrediction, etc.)
│   │   ├── services/             # API calls, ML inference utilities
│   │   ├── assets/               # Images, icons, fonts
│   │   ├── styles/               # Global styles, themes
│   │   ├── ml/                   # TensorFlow Lite models & preprocessing logic
│   │   └── App.js                # App entry point
│   │
│   ├── android/                  # Native Android build files
│   ├── ios/                      # Native iOS build files
│   └── package.json              # Frontend dependencies
│
├── backend/                      # Node.js + Express backend (optional)
│   ├── src/
│   │   ├── controllers/          # Handle API logic
│   │   ├── models/               # MongoDB schemas (User, Scan, GourdData)
│   │   ├── routes/               # API routes (auth, scans, gourds)
│   │   ├── services/             # Business logic (harvest prediction, analytics)
│   │   ├── utils/                # Helpers (validation, error handling)
│   │   └── app.js                # Main Express app
│   │
│   ├── config/                   # DB config, environment variables
│   ├── uploads/                  # Image uploads (if storing locally, else Cloudinary)
│   └── package.json              # Backend dependencies
│
├── ml-models/                     # ML training & conversion
│   ├── notebooks/                # Jupyter notebooks for training
│   ├── datasets/                 # Raw & processed datasets (images + labels)
│   ├── yolov12-training/          # YOLOv8/YOLOv12 training scripts & config
│   ├── harvest-prediction/       # Regression model training (growth → harvest date)
│   ├── exports/                  # Exported models (YOLO → TFLite, PyTorch → TFLite)
│   └── requirements.txt          # Python dependencies
│
├── docs/                         # Documentation
│   ├── architecture.md           # System workflow/architecture overview
│   ├── setup-guide.md            # Installation & setup instructions
│   ├── api-reference.md          # Backend API documentation
│   └── README.md                 # Project overview
│
├── .gitignore
└── README.md                     # Main project readme
