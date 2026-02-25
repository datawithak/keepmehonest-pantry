import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBLyc64a71HWVF6oDwA_-4-BbTqds-SUOc',
  authDomain: 'zuby-pantry.firebaseapp.com',
  projectId: 'zuby-pantry',
  storageBucket: 'zuby-pantry.firebasestorage.app',
  messagingSenderId: '351362764704',
  appId: '1:351362764704:web:97708c61ba7c65f79b1ec5',
  measurementId: 'G-DPYMSN73QG',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
