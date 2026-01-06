
// Initialize Firebase using the standard modular SDK (v9+)
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Always use process.env.API_KEY as the exclusive source for API keys
  apiKey: process.env.API_KEY,
  authDomain: "tk-kreatif-studio.firebaseapp.com",
  projectId: "tk-kreatif-studio",
  storageBucket: "tk-kreatif-studio.firebasestorage.app",
  messagingSenderId: "289470047640",
  appId: "1:289470047640:web:f681ac7132a76f758a37ed",
  measurementId: "G-7ZTP9VK4YX"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
