import { initializeApp } from "@react-native-firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAS05mWXgU2onGUGDFjszlERMqUqmS79EI",
  authDomain: "wfka-app.firebaseapp.com",
  projectId: "wfka-app",
  storageBucket: "wfka-app.appspot.com",
  messagingSenderId: "753953650648",
  appId: "1:753953650648:web:e5172700829c131df5a4ad",
  measurementId: "G-P9GLM9TW1Q"
};

export const app = initializeApp(firebaseConfig);