
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";

// Configuração do Firebase JS SDK v7.20.0
const firebaseConfig = {
  apiKey: "AIzaSyCbG-vyVdKGQ6zKyQOAXIIX-fkM83Pzefg",
  authDomain: "prime-green.firebaseapp.com",
  projectId: "prime-green",
  storageBucket: "prime-green.firebasestorage.app",
  messagingSenderId: "819761690891",
  appId: "1:819761690891:web:0ca9dbd897ff88571f0a0e",
  measurementId: "G-617S828XJS"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);

// Serviços utilizados pelo Prime Clube
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
