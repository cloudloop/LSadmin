<script>
  let loading = true;

    import { onMount } from 'svelte';
    import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
    import { db } from '$lib/firebase';

    console.log(`Disable SSR`);
    export const ssr = false; // Disable SSR for just this route

    export async function load() {
  // Client-side only data loading
  console.log(`Awainting db`);
  const { db } = await import('$lib/firebase');
  console.log(`Awaiting collection & getDocs`);
  const { collection, getDocs, getDoc } = await import('firebase/firestore');
  
    try {
      console.log(`Trying to get a snapshot`);
      const snapshot = await getDoc(collection(db, 'allowed'));
      console.log(`Raw snapshot ${snapshot}`);
      return {
        props: {
          stores: snapshot.docs.map(d => d.data())
        },
      };
    } catch (error) {
      return {
        status: 500,
        error: new Error(`Firestore load failed: ${error.message}`)
      };
    }
  }


    // In your component
    import { browser } from '$app/environment';
  
    // let allowedStores = [];
    // let disallowedStores = [];
    // 
    // let error = null;
    // let searchAllowed = '';
    // let searchDisallowed = '';
  
    // //New fetchStores
    // async function fetchStores() {
    // try {
    //     loading = true;
    //     error = null;

    //     //Checking DB connection
    //     console.log(`${db}`);
        
    //     console.log('Starting fetch operation...');
    //      // Try to get a specific document first (if you know an ID)
    //     console.log(`Fetching single document...`);
    //     const singleDocRef = doc(db, 'allowed', 'SE1001');
    //     const singleDocSnap = await getDoc(singleDocRef);
    //     console.log('Single doc exists:', singleDocSnap.exists());
    //     console.log('Single doc data:', singleDocSnap.data());


    //     console.log(`Fetching whole DB`);
    //     const allowedRef = collection(db, 'allowed');
    //     console.log('Collection reference created');

    //     // Add this debug check
    //     console.log('Collection path:', allowedRef.path);
        
    //     const allowedSnapshot = await getDocs(allowedRef);
    //     console.log('Raw snapshot:', allowedSnapshot);
    //     console.log('Empty?:', allowedSnapshot.empty);

    //     if (allowedSnapshot.empty) {
    //         console.log('No documents found in collection');
    //         allowedStores = [];
    //         return;
    //     }

    //     console.log(`Fetched ${allowedSnapshot.size} documents`);
        
    //     allowedStores = allowedSnapshot.docs.map(doc => {
    //         const data = doc.data();
    //         console.log('Document data:', data);
    //         return {
    //             id: doc.id,
    //             storeid: data.storeid
    //         };
    //     });
        
    //     console.log('Fetch operation completed successfully');
    // } catch (err) {
    //     console.error('Detailed error:', err);
    //     error = `Failed to fetch stores: ${err.message} (${err.code})`;
    //     toast.push({
    //         message: error,
    //         theme: {
    //             '--toastBackground': '#F87171',
    //             '--toastColor': 'white'
    //         }
    //     });
    // } finally {
    //     loading = false;
    // }
    // }
  
    onMount(() => {
        if (browser) {
            load();
        }  
    });
  </script>
  
  <!-- Version 1: Drag and Drop -->
  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="loading loading-spinner loading-lg text-primary"></div>
    </div>
  {:else}
  <div class="flex justify-center items-center h-64">
    <p class="text-2xl font-bold text-center text-green-500 animate-bounce">
      I'm not loading anymore....


    </p>
  </div>
  {/if}
