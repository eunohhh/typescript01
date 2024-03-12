// Import the functions you need from the SDKs you need
import "firebase/compat/firestore";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGIN_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
}; 

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp); 

// const user = await signInWithEmailAndPassword(auth, process.env.NEXT_PUBLIC_FIREBASEID, process.env.NEXT_PUBLIC_FIREBASEPW) // 게스트 로그인
// const models = await firebaseInitModel(); // userinfo

export { firebaseApp, db, auth, storage }; // userinfo, firebaseInitHub