const { initializeApp } = require('firebase-admin/app');
// const { initializeApp } = require('firebase/app')
// const { getFirestore, setDoc, doc, getDocs, deleteDoc, collection } = require('firebase/firestore');
const Firestore = require('@google-cloud/firestore');

const firebaseApp = initializeApp({
    apiKey: "AIzaSyAPh4N9kRH9ggF-mewMKlbJxvxjppUfwcY",
    authDomain: "twitch-bedbot.firebaseapp.com",
    projectId: "twitch-bedbot",
    storageBucket: "twitch-bedbot.appspot.com",
    messagingSenderId: "884871580465",
    appId: "1:884871580465:web:2fd1a613d0582d381dbe10",
    measurementId: "G-PR5WDYB0PN"
  })
  
// const db = getFirestore(firebaseApp);

const db = new Firestore({
  projectId: 'twitch-bedbot',
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

exports.getAllIgnoredUsers = async function (dataArray) {

  // const colRef = collection(db, "users");

  try {

    // const docsSnap = await getDocs(colRef);
    const docsSnap = await db.collection('users').get();


    if(docsSnap.docs.length > 0) {
       docsSnap.forEach(doc => {
          console.log(doc.id);
          dataArray.push({
    
            id: parseInt(doc.id),
            username: doc.data().name

          })
       })
    }
  } catch (error) {
    console.log(error);
  }

}
  
exports.addUsertoIgnoreList = async function (name, id, listName) {

  const ignoreList = listName;

  // const docRef = doc(db, "users", id);
  const docRef = db.collection('users').doc(id);

  let data = {
    name: name
  }
  

  await docRef.set({
    data
  })

  // setDoc(docRef, data)
    .then((docRef) => {
      console.log(`Document has been added successfully.`);

      ignoreList.push({
        id: parseInt(id),
        username: name         
      });

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