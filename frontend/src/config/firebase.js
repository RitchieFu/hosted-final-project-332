import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  // Use environment variable for API key
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  authDomain: "cpsc322.firebaseapp.com",
  projectId: "cpsc322",
  storageBucket: "cpsc322.firebasestorage.app",
  messagingSenderId: "271614418510",
  appId: "1:271614418510:web:78ab06a3eddbdd816c6d1f",
  measurementId: "G-8WLJ50EKHT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };

