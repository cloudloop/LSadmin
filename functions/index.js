/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest, onCall} from "firebase-functions/v2/https";
import logger from "firebase-functions/logger";

//AllowCORS only needed for onRequest functions, and not for onCall functions
import {allowCors} from "../src/lib/cors.js";

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started



const helloWorld2 = onCall(async (data, context) => {
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

import { updateStoreSettings } from "./SecureUpdate.js";

export { updateStoreSettings };


