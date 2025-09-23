// Firebase Web Configuration
// This config is used for web-based authentication (WebBrowser OAuth)

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvhBWvRrTR8nQPmT10FCN9HkLQ59MaqEI",
  authDomain: "thesis-bbe0c.firebaseapp.com",
  projectId: "thesis-bbe0c",
  storageBucket: "thesis-bbe0c.firebasestorage.app",
  messagingSenderId: "615143258112",
  appId: "1:615143258112:web:fce99f9c725ba38dd840e5",
  measurementId: "G-SL40KZJB4S"
};

// Initialize Firebase for web
const firebaseApp = initializeApp(firebaseConfig, 'web-app');
const auth = getAuth(firebaseApp);

export { firebaseApp, auth, firebaseConfig };