// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDV8A0dgMFeSJ8WumSGI_YBXULp92kQKAI",
  authDomain: "fir-c4fa9.firebaseapp.com",
  projectId: "fir-c4fa9",
  storageBucket: "fir-c4fa9.appspot.com",
  messagingSenderId: "63836388369",
  appId: "1:63836388369:web:47886a975ae3e80b3405b0",
  measurementId: "G-JQBZSJ32ST"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const imageDb= getStorage(app)
const firestoreDb = getFirestore(app);

export { imageDb, firestoreDb };