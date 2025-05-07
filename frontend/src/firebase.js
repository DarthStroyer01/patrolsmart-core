// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB9p2h1wsEXcIZMn2IzCV968b0P4B4w05c",
    authDomain: "patrolsmart-core.firebaseapp.com",
    projectId: "patrolsmart-core",
    storageBucket: "patrolsmart-core.firebasestorage.app",
    messagingSenderId: "162220096893",
    appId: "1:162220096893:web:26d2545fa2f8ab29986014",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
