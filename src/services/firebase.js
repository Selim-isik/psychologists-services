import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC0qFI35ofqO47BCfMxsOic0XB2E4roZOI",
  authDomain: "psychservices-c250b.firebaseapp.com",
  databaseURL:
    "https://psychservices-c250b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "psychservices-c250b",
  storageBucket: "psychservices-c250b.firebasestorage.app",
  messagingSenderId: "775499235208",
  appId: "1:775499235208:web:ccefc408c6e107a894c43d",
  measurementId: "G-YMZLPDKTPS",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
