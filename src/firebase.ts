import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJQS6A7RmaymCoPZBw0sNjAFlc6qreTok",
  authDomain: "portfolio-admin-cb66a.firebaseapp.com",
  projectId: "portfolio-admin-cb66a",
  storageBucket: "portfolio-admin-cb66a.firebasestorage.app",
  messagingSenderId: "953064734268",
  appId: "1:953064734268:web:71d2e7a1bf63adec978d39"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);