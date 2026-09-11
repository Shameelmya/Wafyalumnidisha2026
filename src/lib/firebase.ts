// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRUXqfPyP32733xlEBHQbdHO2gk6AmQO8",
  authDomain: "wafy-alumni-disha-registration.firebaseapp.com",
  projectId: "wafy-alumni-disha-registration",
  storageBucket: "wafy-alumni-disha-registration.firebasestorage.app",
  messagingSenderId: "1004330765019",
  appId: "1:1004330765019:web:b3898c85fb4ba35db11afe"
};

// Initialize Firebase (prevent re-initialization error in Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, app, auth };
