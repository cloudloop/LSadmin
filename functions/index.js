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

import {onCall, HttpsError} from "firebase-functions/v2/https";
import logger from "firebase-functions/logger";

//AllowCORS only needed for onRequest functions, and not for onCall functions
//import {allowCors} from "../src/lib/cors.js";

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const options = {
    cors: [/firebase\.com$/,/run\.app$/, "https://flutter.com", "http://localhost:3000", /^http:\/\/localhost:\d{4}$/, "0.0.0.0:8080"],
    //cors: [true],
    region: "europe-north1",
    maxInstances: 1,
    memory: "256MiB",
    timeoutSeconds: 180,
}

export const helloworld = onCall(options, (req) => {
    const uid = req.auth.uid;
    const email = req.auth.token.email || null;
    console.log(`Hello from ${uid} (${email})`);
    // Log the received data to debug
    logger.info({"Received data": req.data});

   // Checking attribute.
    if (!(typeof req.data === "object") || Object.entries(req.data).length === 0) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new HttpsError("invalid-argument", "The function must be called " +
                "with one arguments \"text\" containing the object to add.");
    }
    // Checking that the user is authenticated.
    if (!req.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new HttpsError("failed-precondition", "The function must be " +
                "called while authenticated.");
    }

    // If data is passed from the client, we can access it here
    // Ensure the payload structure is as expected
    const name = req.data?.name;
    const age = req.data?.age;

    if (!name || !age) {
    throw new Error("Invalid input data");
    }

  return { message: `Hello ${name}, you are ${age} years old!` };
});


/////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////



import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { initializeApp, applicationDefault } from "firebase-admin/app";

// Initialize Firebase Admin
initializeApp({
    credential: applicationDefault(),
  });
const db = getFirestore(undefined, "db01")

export const updatestoresettings = onCall(options, async (req) => {
    const uid = req.auth.uid;
    const email = req.auth.token.email || null;
    const storeId = req.data.storeid;
    const LSallowed = req.data.LSallowed;

    console.log(`Hello from ${uid} (${email})`);
    // Log the received data to debug
    logger.info({"Received data": req.data});

    // Checking attribute.
    if (!(typeof req.data === "object") || Object.entries(req.data).length === 0) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new HttpsError("invalid-argument", "The function must be called " +
                "with one arguments \"text\" containing the object to add.");
    }
    // Checking that the user is authenticated.
    if (!req.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new HttpsError("failed-precondition", "The function must be " +
                "called while authenticated.");
    }
    // Validate input
    if (!storeId || typeof LSallowed !== "boolean") {
        throw new Error("Invalid input data");
    }

    try {
        // // Fetch user roles from Firestore (if needed)
        const userDoc = await db.collection("admin").doc(email).get();

        if (!userDoc.exists) {
            logger.info(`User ${email} (UID: ${uid}) does not exists in admin list. Creating role and setting permissions to false.`);
            db.collection("admin").doc(email).set({ admin: false, uid: uid });
        }
            
        if (!userDoc.data()?.admin) {
            logger.error(`User ${email} (UID: ${uid}) attempted to update store settings without permission`);
            throw new HttpsError("permission-denied", "Insufficient permissions");
        }
        
        // // Perform the update
        await db.collection("LSstore").doc(storeId).update({ LSallowed: LSallowed, lastEdit: FieldValue.serverTimestamp(), user: email , uid: uid });

        logger.info(`Store settings updated for store ${storeId} to ${LSallowed} by user ${email} (UID: ${uid})`);
        return { success: true, message: `Update successful. ${storeId} is now ${LSallowed}`};
    } catch (error) {
        logger.error("Firestore operation failed:", error);
        return { success: false, message: error.message };
    }
});