import firebase from "firebase/compat/app";
import { getDatabase } from "firebase/database";
import 'firebase/compat/storage';


const firebaseConfig = {
  apiKey: "AIzaSyDYzNxOVmMbrHxggHzEzzy8wF8_-b-mepY",
  authDomain: "leafwise-2.firebaseapp.com",
  databaseURL: "https://leafwise-2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "leafwise-2",
  storageBucket: "leafwise-2.appspot.com",
  messagingSenderId: "1005980205286",
  appId: "1:1005980205286:web:a7523ef5ebb17188a2bb27",
  measurementId: "G-TKKD4LEBY8"
}

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const db = getDatabase();

export { db , firebase }