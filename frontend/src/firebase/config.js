// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);