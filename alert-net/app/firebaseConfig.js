import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAq1T-74AwBW6eNAI-PKLwO_NSG76MMjbE",
  authDomain: "alertnet-12de6.firebaseapp.com",
  projectId: "alertnet-12de6",
  storageBucket: "alertnet-12de6.firebasestorage.app",
  messagingSenderId: "236263651864",
  appId: "1:236263651864:web:161c0a404db5cc6842216d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
