import * as admin from 'firebase-admin'
const dotenv = require('dotenv')
dotenv.config()
var serviceAccount = require(`../${process.env.FIREBASE_SERVICE_ACCOUNT_FILE}`);
export const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET
});
