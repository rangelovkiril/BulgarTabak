import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9EuiVrxQxS7PdHo5iOj2Yn1r_99DsC8Q",
  authDomain: "chronoflow-8417d.firebaseapp.com",
  projectId: "chronoflow-8417d",
  storageBucket: "chronoflow-8417d.firebasestorage.app",
  messagingSenderId: "47772991321",
  appId: "1:47772991321:web:36ccdd0f022652b87c5648",
  measurementId: "G-VX9F2TB9ZZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Google sign in function
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Return user info
    return {
      user: {
        id: result.user.uid,
        email: result.user.email,
        name: result.user.displayName,
        isNewUser:
          result.user.metadata.creationTime ===
          result.user.metadata.lastSignInTime,
      },
    };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Check authentication state
export const checkAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Sign out
export const signOut = () => auth.signOut();

export { auth, db };
