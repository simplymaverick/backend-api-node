const admin = require('firebase-admin');
const serviceAccount = require('./rhandzu-bakery-67c9751e3842.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://rhandzu-bakery-default-rtdb.firebaseio.com'
});

const db = admin.firestore();

module.exports = db;