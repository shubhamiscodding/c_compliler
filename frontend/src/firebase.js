import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCFs0r0FXIkXVWDSYQaUnNtyw7VpHeemn8",
  authDomain: "online-c-compiler-c4ccb.firebaseapp.com",
  projectId: "online-c-compiler-c4ccb",
  storageBucket: "online-c-compiler-c4ccb.appspot.com",
  messagingSenderId: "229739687141",
  appId: "1:229739687141:web:2e47849d828e6b4b63380c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure auth for development environment
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Don't connect to emulator in production, only use it if explicitly set up
  // connectAuthEmulator(auth, 'http://localhost:9099');
}

// Initialize Analytics only if not blocked
let analytics = null;
// Disable analytics for now to avoid import errors
// if (typeof window !== 'undefined' && !window.isAnalyticsBlocked) {
//   try {
//     import('firebase/analytics').then(({ getAnalytics }) => {
//       analytics = getAnalytics(app);
//     }).catch(() => {
//       console.log('Analytics blocked or unavailable');
//     });
//   } catch (error) {
//     console.log('Analytics blocked or unavailable');
//   }
// }

export { app, auth, analytics };
