import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration
// You need to replace these with your own Firebase project credentials
// Go to: https://console.firebase.google.com/
// Create a new project → Add web app → Copy config
const firebaseConfig = {
  apiKey: "AIzaSyCdS2P5PiRST5kZBDZ3rnacQAvgAGvdfkk",
  authDomain: "laazytestground.firebaseapp.com",
  databaseURL: "https://laazytestground-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "laazytestground",
  storageBucket: "laazytestground.firebasestorage.app",
  messagingSenderId: "434377008546",
  appId: "1:434377008546:web:0c548dad6aee8419dcfefb",
  measurementId: "G-P1ZMFFQ5L2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
