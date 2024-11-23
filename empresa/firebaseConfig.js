import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, where, deleteDoc, updateDoc, addDoc,  arrayUnion, Timestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDJBNL9rh1cJnY0qKpqsuuyp2asjmG6abs",
  authDomain: "skillswap-1104.firebaseapp.com",
  projectId: "skillswap-1104",
  storageBucket: "skillswap-1104.appspot.com",
  messagingSenderId: "665738513533",
  appId: "1:665738513533:web:a4ae8da62cadcf5c1cb514",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, setDoc, doc, getDoc, collection, getDocs, query, where,deleteDoc, updateDoc, addDoc, arrayUnion, Timestamp, onSnapshot };
