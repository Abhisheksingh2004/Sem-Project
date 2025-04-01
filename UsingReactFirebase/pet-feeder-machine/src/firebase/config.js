// Firebase configuration file
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVgDlKx53GgEWih6E-9A8XL-UrA1VCsYI",
  authDomain: "autopetfeed-12.firebaseapp.com",
  projectId: "autopetfeed-12",
  storageBucket: "autopetfeed-12.firebasestorage.app",
  messagingSenderId: "938206955628",
  appId: "1:938206955628:web:5521a2a157bfa8cf3cb049",
  measurementId: "G-H2J7F9X85D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, db, storage, analytics }; 