import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAS05mWXgU2onGUGDFjszlERMqUqmS79EI",
  authDomain: "wfka-app.firebaseapp.com",
  projectId: "wfka-app",
  storageBucket: "wfka-app.appspot.com",
  messagingSenderId: "753953650648",
  appId: "1:753953650648:web:e5172700829c131df5a4ad",
  measurementId: "G-P9GLM9TW1Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});