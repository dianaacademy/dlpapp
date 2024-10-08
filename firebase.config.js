import app from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import analytics from '@react-native-firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBMgD92jWYxvkeSYkElx7DkCqh3a3OlK30",
  authDomain: "ddlp-456ce.firebaseapp.com",
  projectId: "ddlp-456ce",
  storageBucket: "ddlp-456ce.appspot.com",
  messagingSenderId: "133537517881",
  appId: "1:133537517881:web:7f41d03e7deed4c0ed98e8",
  measurementId: "G-VXJGENCYD1",
};

if (!app().apps.length) {
  app().initializeApp(firebaseConfig);
}

export { app, auth, firestore, storage, database, analytics };