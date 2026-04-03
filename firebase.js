import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyDOKcfkhuFO6TChfSSX4Oq8MSqwUt2ohFI",
  authDomain: "portfolio-b6884.firebaseapp.com",
  projectId: "portfolio-b6884",
  storageBucket: "portfolio-b6884.firebasestorage.app",
  messagingSenderId: "355035173718",
  appId: "1:355035173718:web:11048dd35acc32d608bcf7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);