<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();

    // Import neccesities
    import { getContext, onMount } from 'svelte';
    import { collection, getDocs, updateDoc, getDoc, deleteDoc, setDoc ,doc, serverTimestamp} from 'firebase/firestore';
    import { db } from '$lib/firebase'
    import { logEvent, getAnalytics } from "firebase/analytics";
    const analytics = getAnalytics();


    //Import global user context to check login status
    const user = getContext("user");

    //Defining Runes
    let loading = $state(true);
    let error = $state(null);
    let dbObjects = $state([]);

    //fetch function. Fetch store info from firestore
    async function fetchStores() {
    try {
        loading = true;
        error = null;
        // console.log('Starting fetch operation...');
        // console.log(`Fetching whole DB`);
        const allowedRef = collection(db, 'LSstore');
        // console.log('Collection reference found');
        // console.log('Collection path:', allowedRef.path);
        
        const dbResponse = await getDocs(allowedRef);
        dbObjects = dbResponse.docs.map(doc => doc.data());
        // console.log(`${dbObjects.length} documents found in collection`);


    } catch (err) {
        console.error('Detailed error:', err);
        error = `Failed to fetch stores: ${err.message} (${err.code})`;
    }
    finally {
        loading = false;
    }};

    async function toggleChange(event) {
        try {
            const storeid = event.target.dataset.storeid;
            const newLSallowed = event.target.checked;
            const storeRef = doc(db, 'LSstore', storeid);
            await updateDoc(storeRef, {LSallowed: newLSallowed, lastEdit: serverTimestamp(), user: $user.email});
            console.log(`Updated ${storeid} to ${newLSallowed}`);

            logEvent(analytics, 'store_toggled', {
                storid: storeid,
                toggled_to: newLSallowed,
              });

        // Optimistically update UI
        dbObjects = dbObjects.map(store => 
                store.storeid === storeid ? { ...store, LSallowed: newLSallowed,user: $user.email } : store
            );
        } catch (err) {
            console.error("Error updating Firestore:", err);
        }
    }

    onMount(fetchStores);
</script>

{#if loading}
    <div class="flex justify-center items-center h-64 g-3" >
        <div class="text-2xl pr-3">Loading</div><div class="loading loading-spinner loading-lg text-primary"></div>
      </div>
{:else}

<div class="overflow-x-auto pt-5">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
            <th></th>
          <th>StoreID</th>
          <th>L&S Allowed</th>
          <th>Last edited</th>
          <th>Last edit by</th>
          <th>Change</th>
        </tr>
      </thead>
      <tbody>
        {#each dbObjects as storeObject}
          <tr>
            <th></th>
            <th>{storeObject.storeid}</th>
            <td>{storeObject.LSallowed}</td>
            <td>{storeObject.lastEdit}</td>
            <td>{storeObject.user}</td>
            <td><input type="checkbox" class="toggle" checked={storeObject.LSallowed} data-storeid={storeObject.storeid} onchange={toggleChange}/></td>
          </tr>
        {/each}
    </tbody>
    </table>
    </div>
{/if}