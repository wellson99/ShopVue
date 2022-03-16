import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getAuth, onAuthStateChanged} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAm-wDCvFx0g9XO_zbM2-cs9tFnaLCgDT0",
  authDomain: "miniproject-eb346.firebaseapp.com",
  projectId: "miniproject-eb346",
  storageBucket: "miniproject-eb346.appspot.com",
  messagingSenderId: "12657872672",
  appId: "1:12657872672:web:ee5f592816601a30e41145",
  measurementId: "G-ZBCMRW04RM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const userState = () => new Promise(
  (resolve, reject) => onAuthStateChanged(getAuth(), resolve, reject)
)

export {db, userState}