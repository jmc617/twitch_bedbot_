const { initializeApp } = require('firebase/app')
const { getFirestore, setDoc, doc, deleteDoc } = require('firebase/firestore');

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
  
exports.addUsertoIgnoreList = async function (name, id, listName) {

  const ignoreList = listName;

  const docRef = doc(db, "users", id);

  let data = {
    name: name
  }
  
  setDoc(docRef, data)
    .then((docRef) => {
      console.log(`Document has been added successfully.`);

      ignoreList.push({
        id: parseInt(id),
        username: name         
      });

      console.log(ignoreList);
    })
    .catch(error => {
      console.log(error);
    })
  };

  exports.removeUserFromIgnoreList = async function ( id ) {
    
    const docRef = doc(db, "users", id);
    
    deleteDoc(docRef)
    .then(() => {

      console.log(`Document has been deleted successfully.`);

    })
    .catch(error => {
        console.log(error);
    })
  };