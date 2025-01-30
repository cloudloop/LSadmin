/** @type {import('./$types').PageServerLoad} */


import { fail } from '@sveltejs/kit';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import {init } from '$lib/firebase';
const db = getFirestore();

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const storeId = data.get('storeId')?.toString() || '';

    // Basic validation
    if (!storeId) {
      return fail(400, { error: 'Store ID is required' });
    }

    // If matches pattern: 2 uppercase letters + 4 digits
    if (storeId.match(/^[A-Z]{2}[0-9]{4}$/)) {
      try {
        await addDoc(collection(db, 'approved'), {
          storeID: storeId,
          LS: true
        });
        console.log('Store ID submitted:', storeId);
      } catch (e) {
        console.error('Error adding document:', e);
        // Possibly return fail(...) here if you want to show an error to the user
      }

      return { success: true, storeId };
    } else {
      // If it doesn't match, fail the request
      return fail(400, { error: 'Store ID must be in AA9999 format' });
    }
  }
};

