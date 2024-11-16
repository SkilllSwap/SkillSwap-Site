import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJBNL9rh1cJnY0qKpqsuuyp2asjmG6abs",
  authDomain: "skillswap-1104.firebaseapp.com",
  projectId: "skillswap-1104",
  storageBucket: "skillswap-1104.appspot.com",
  messagingSenderId: "665738513533",
  appId: "1:665738513533:web:a4ae8da62cadcf5c1cb514",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Auth e o Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Exportando as funções para usar em outros arquivos
export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, setDoc, doc, getDoc };
