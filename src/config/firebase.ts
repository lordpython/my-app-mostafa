import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyD5F1HmiO2hTSvVu93vjNONg0Mc4BIIUpk",
  authDomain: "mostafa-game-2024.firebaseapp.com",
  projectId: "mostafa-game-2024",
  storageBucket: "mostafa-game-2024.appspot.com",
  messagingSenderId: "602224996744",
  appId: "1:602224996744:web:36cf78a16da1d42ed04a3d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize App Check in debug mode
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = 'E8A278BB-24D5-4CDF-8A12-25BB72E1774A';
}

// Initialize App Check
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
  isTokenAutoRefreshEnabled: true
});

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
