import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Web app's firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxYpDy7pBLTjGsS8RLpJokJ513yawA_7k",
  authDomain: "smart-driver-assistant-ser517.firebaseapp.com",
  projectId: "smart-driver-assistant-ser517",
  storageBucket: "smart-driver-assistant-ser517.appspot.com",
  messagingSenderId: "497979674501",
  appId: "1:497979674501:web:76ecec57c6afa939a6feec",
  measurementId: "G-LYZEN14SJR"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);