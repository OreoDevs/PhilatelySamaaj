import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7KLhZMgXO1Ra7Qvhk-9ObxigcqLEIgPM",
  authDomain: "philatelysamaaj.firebaseapp.com",
  projectId: "philatelysamaaj",
  storageBucket: "philatelysamaaj.appspot.com",
  messagingSenderId: "720565385019",
  appId: "1:720565385019:web:cfa6e1d57f6504a90da91e",
  measurementId: "G-KX54ZL91HH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export { app, auth, db, storage };
