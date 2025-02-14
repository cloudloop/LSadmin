/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});



// // Firebase Functions (index.js)
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');

// admin.initializeApp();

// // HTTP Trigger Function
// exports.httpFunction = functions.https.onRequest((req, res) => {
//   const db = admin.firestore();
//   db.collection('httpLogs').add({
//     timestamp: new Date(),
//     data: req.body
//   });
//   res.status(200).json({ message: 'HTTP Function Executed' });
// });

// // Callable Function
// exports.callableFunction = functions.https.onCall(async (data, context) => {
//   const db = admin.firestore();
//   await db.collection('callableLogs').add({
//     timestamp: new Date(),
//     data: data
//   });
//   return { result: 'Callable Function Completed' };
// });