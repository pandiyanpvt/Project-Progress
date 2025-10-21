// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrjySxKO6wvVITGGmGvrOeBCqObNOWDoc",
  authDomain: "project-progress-tracker-8eda4.firebaseapp.com",
  projectId: "project-progress-tracker-8eda4",
  storageBucket: "project-progress-tracker-8eda4.firebasestorage.app",
  messagingSenderId: "332096719463",
  appId: "1:332096719463:web:24a3c77330c18ebce0e2c2",
  measurementId: "G-KQQJQM0XFW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
