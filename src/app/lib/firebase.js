import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGSnTCnMXY8Choml2ZwzDrZYDyxOu0LCE",
  authDomain: "neset-ertas-blog.firebaseapp.com",
  projectId: "neset-ertas-blog",
  storageBucket: "neset-ertas-blog.firebasestorage.app",
  messagingSenderId: "515524924437",
  appId: "1:515524924437:web:571b9691df0716be252a1c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);