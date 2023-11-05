// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAKqIHnDVcAgCUmGGHgC8B4GXXzVLhuLCw",
  authDomain: "tareasexamenescursopropio.firebaseapp.com",
  projectId: "tareasexamenescursopropio",
  storageBucket: "tareasexamenescursopropio.appspot.com",
  messagingSenderId: "460031126128",
  appId: "1:460031126128:web:6f13ff95cc7017ec1a22b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

