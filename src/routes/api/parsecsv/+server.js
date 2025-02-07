import Papa from 'papaparse';
import { readFileSync } from 'fs';
import { join } from 'path';
import { json } from '@sveltejs/kit';
import { db } from '$lib/firebase'; // Adjust import path as needed
import { getFirestore, collection, doc, writeBatch, serverTimestamp, getDoc } from 'firebase/firestore';


export async function GET() {
  try {
    const filePath = join(process.cwd(), "static", "LS.csv");
    const fileContent = readFileSync(filePath, "utf8");

    const results = Papa.parse(fileContent, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
    });

    if (results.data.length === 0) {
      return json({ 
        success: false, 
        error: "CSV is empty or incorrectly formatted" 
      }, { status: 400 });
    }

    // Bulk write to Firestore
    const batch = writeBatch(db);
    const storesRef = collection(db, 'LSstore');
    let duplicateCounter = 0
    
    for (const row of results.data) {
      if (row.storeid) {
        const docRef = doc(collection(db, "LSstore"), row.storeid);

        // Check if document exists
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            duplicateCounter++;
            console.log(`Document with storeid ${row.storeid} already exists. Skipping.`);
            // You can choose to update it instead of skipping if needed:
            // batch.set(docRef, { ...row }, { merge: true });
        } else {
                batch.set(docRef, {
                storeid: row.storeid,
                LSallowed: row.LSallowed,
                lastEdit: serverTimestamp(),
                user: row.user
                });
            }
        }
    };

    await batch.commit();

    return json({ 
      success: true, 
      imported: results.data.length - duplicateCounter,
      duplicates: duplicateCounter
    });

  } catch (error) {
    return json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}