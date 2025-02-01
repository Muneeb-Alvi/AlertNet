import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "",
    authDomain: "alertnet-f9c61.firebaseapp.com",
    projectId: "alertnet-f9c61",
    storageBucket: "alertnet-f9c61.firebasestorage.app",
    messagingSenderId: "494485818991",
    appId: "1:494485818991:web:d7525c5e9358b16549879a",
    measurementId: "G-KD49Z48S20"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };