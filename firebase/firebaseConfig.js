import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLV5Owe6CVvqgorK8wRmySUOASIGgNum8",
  authDomain: "pocketplan-20f4c.firebaseapp.com",
  projectId: "pocketplan-20f4c",
  storageBucket: "pocketplan-20f4c.firebasestorage.app",
  messagingSenderId: "488525129895",
  appId: "1:488525129895:web:76e77dce41c852f053d382",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;