import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyDTMMfI8bC4xWACuCHxVCGBUnfcGc5OgY4",
  authDomain: "cybertech-comps.firebaseapp.com",
  projectId: "cybertech-comps",
  storageBucket: "cybertech-comps.firebasestorage.app",
  messagingSenderId: "82828043865",
  appId: "1:82828043865:web:a7385d2ba61fa031e9f348",
};

// Initialize Firebase safely for SSR/Client
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = typeof window !== "undefined" ? getAuth(app) : (null as any);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
};
