// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDocs, addDoc, collection, query, where } from 'firebase/firestore'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC3qR4XlbWmlqbho9kJCaHYXltqD8jldt4",
    authDomain: "auction-lotting-project.firebaseapp.com",
    databaseURL: "https://auction-lotting-project-default-rtdb.firebaseio.com",
    projectId: "auction-lotting-project",
    storageBucket: "auction-lotting-project.appspot.com",
    messagingSenderId: "93596808946",
    appId: "1:93596808946:web:ad922195e1cf4433ec426b",
    measurementId: "G-972X0NNKEY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export default app;

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, addDoc, setDoc, getDocs, collection, query, where };