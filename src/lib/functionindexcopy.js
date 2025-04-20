/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import {onCall} from "firebase-functions/v2/https";
import logger from "firebase-functions/logger";

//AllowCORS only needed for onRequest functions, and not for onCall functions
//import {allowCors} from "../src/lib/cors.js";

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const onCallarg1 = {
    cors: [/firebase\.com$/,/run\.app$/, "https://flutter.com", "http://localhost:3000", "http://localhost:5173", "0.0.0.0:8080"],
    region: "europe-north1",
    maxInstances: 1,
    memory: "256MiB",
    timeoutSeconds: 180,
}

export const helloworld = onCall(onCallarg1 ,async (data, context) => {
  
  //allowCors(request, response);
   // Ensure user is authenticated
   if (!context.auth) {
      throw new Error("Unauthorized");
  }

  // If data is passed from the client, we can access it here
  const { name, age } = data;

  logger.info("Received data:", { name, age });

  return { message: `Hello ${name}, you are ${age} years old!` };
});


/////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////



import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

export const updatestoresettings = onCall( onCallarg1, async (data, context) => {
    // Ensure user is authenticated
    if (!context.auth) {
        throw new Error("Unauthorized");
    }

    const userId = context.auth.uid;
    const { storeid, LSallowed } = data;

    // Validate input
    if (!storeid || typeof LSallowed !== "boolean") {
        throw new Error("Invalid input data");
    }

    try {
        // Fetch user roles from Firestore (if needed)
        const userDoc = await db.collection("users").doc(userId).get();
        const userData = userDoc.data();

        if (!userData || !userData.isAdmin) {
            throw new Error("Insufficient permissions");
        }

        // Perform the update
        await db.collection("stores").doc(storeid).update({ LSallowed });

        return { success: true, message: "Update successful" };
    } catch (error) {
        return { success: false, message: error.message };
    }
});