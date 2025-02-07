/** @type {import('./$types').RequestHandler} */
export async function GET() {
    return new Response();
};

import { json } from '@sveltejs/kit';
import { db } from '$lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET({ params }) {
    const { storeid } = params;
    const storeIdPattern = /^[A-Z]{2}\d{4}$/; // Matches XX0123 format

    if (!storeid || !storeIdPattern.test(storeid)) {
        return json({ error: 'Invalid format.' }, { status: 400 });
    }

    if (!storeid) {
        return json({ error: 'Missing params' }, { status: 400 });
    }

    try {
        const storeRef = doc(db, 'LSstore', storeid);
        const storeSnap = await getDoc(storeRef);

        if (!storeSnap.exists()) {
            return json({ error: 'Store not found' }, { status: 404 });
        }

        const LSallowed = storeSnap.data().LSallowed ?? false; // Default to false if missing

        return json({ storeid,LSallowed }, { status: 200 });
    } catch (error) {
        console.error('Firestore fetch error:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
