import { initializeApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBmtRSbkFMh6DE2I_z6cyCVOQ6SnuWDDXA",
  authDomain: "animalrescue-640d6.firebaseapp.com",
  projectId: "animalrescue-640d6",
  storageBucket: "animalrescue-640d6.appspot.com",
  messagingSenderId: "679265060026",
  appId: "1:679265060026:web:290a4da00ea05399d5ee83",
  measurementId: "G-CN3R020091"
};

// Initialize Firebase app
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Initialize auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Set auth persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Firebase persistence error:", error);
});

export { auth, db };
