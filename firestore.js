const Firestore = require('@google-cloud/firestore');  

const db = new Firestore({
  projectId: 'twitch-bedbot',
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

exports.getAllIgnoredUsers = async function (dataArray) {

  try {

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
  const docRef = db.collection('users').doc(id);

  let data = {
    name: name
  }
  
  await docRef.set({
    data
  })
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
       
  await db.collection('users').doc(id).delete()
  .then(() => {

    console.log(`Document has been deleted successfully.`);

  })
  .catch(error => {
    console.log(error);
  })

};