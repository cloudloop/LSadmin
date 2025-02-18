import { onCall } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

export const updateStoreSettings = onCall(async (data, context) => {
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

