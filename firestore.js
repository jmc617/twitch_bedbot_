const { initializeApp } = require('firebase/app')
const { collection, getFirestore, addDoc } = require('firebase/firestore');

const firebaseApp = initializeApp({
    apiKey: "AIzaSyAPh4N9kRH9ggF-mewMKlbJxvxjppUfwcY",
    authDomain: "twitch-bedbot.firebaseapp.com",
    projectId: "twitch-bedbot",
    storageBucket: "twitch-bedbot.appspot.com",
    messagingSenderId: "884871580465",
    appId: "1:884871580465:web:2fd1a613d0582d381dbe10",
    measurementId: "G-PR5WDYB0PN"
  })
  
  const db = getFirestore(firebaseApp);
  const dbRef = collection(db, "users"); 


exports.addUsertoIgnoreList = async function (name) {
    let data = {
        //add user-id
        name: name
      } 
    
      addDoc(dbRef, data)
      .then(docRef => {
        console.log(`Document #${docRef.id} has been added successfully`);
      })
      .catch(error => {
        console.log(error);
      })
  };