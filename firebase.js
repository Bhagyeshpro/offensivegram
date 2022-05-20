// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getStorage } from 'firebase/storage'
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoMNGHhMwQi8PgZXSehraaOwBtBf9cUpk",
  authDomain: "offensivegrm.firebaseapp.com",
  projectId: "offensivegrm",
  storageBucket: "offensivegrm.appspot.com",
  messagingSenderId: "322416780104",
  appId: "1:322416780104:web:6ab1e644731d39f90b897d",
  measurementId: "G-FNXBS681DS"
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const storage = getStorage()

export { app, db, storage }
