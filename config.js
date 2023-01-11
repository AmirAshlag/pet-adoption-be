const { initializeApp } = require('firebase/app')
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyD5iF7rBDLeP3vjnMxU5bNfETMO8iRId34",
  authDomain: "pet-store-967b6.firebaseapp.com",
  projectId: "pet-store-967b6",
  storageBucket: "pet-store-967b6.appspot.com",
  messagingSenderId: "1052204438581",
  appId: "1:1052204438581:web:ab2bd81234efc012b48d7c",
  measurementId: "G-0DZQ6NN2XN",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = storage