// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-74b34.firebaseapp.com",
  projectId: "mern-estate-74b34",
  storageBucket: "gs://mern-estate-74b34.appspot.com",
  messagingSenderId: "143842833020",
  appId: "1:143842833020:web:30ecd3cb9c1b53f34f4ff9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
