<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();

    // Import neccesities
    import { getContext, onMount } from 'svelte';
    import { collection, getDocs, updateDoc, getDoc, deleteDoc, setDoc ,doc, serverTimestamp} from 'firebase/firestore';
    import { db } from '$lib/firebase'
    import { logEvent, getAnalytics } from "firebase/analytics";
    const analytics = getAnalytics();
    
    //Implementing Firebase Functions
    import { getFunctions, httpsCallable } from "firebase/functions";
	  import { app } from '$lib/firebase.js';
    // Get a reference to the functions
    const func = getFunctions(app, 'europe-north1');


    //Import global user context to check login status
    const user = getContext("user");

    //Defining Runes
    let loading = $state(true);
    let error = $state(null);
    let dbObjects = $state([]);

    // New state for search and sort
    let searchTerm = $state('');
    let filteredObjects = $derived(getFilteredObjects());
    let sortColumn = $state('storeid');
    let sortDirection = $state('asc');

    // New function to handle column sorting
    function sortData(column) {
        // If clicking the same column, toggle direction
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // New column, default to ascending
            sortColumn = column;
            sortDirection = 'asc';
        }
    }

    // New function to apply search filter and sorting
    // Function to get filtered and sorted objects
    function getFilteredObjects() {
        if (loading || !dbObjects.length) {
            return [];
        }

        // Filter by search term
        let filtered = dbObjects;
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            filtered = dbObjects.filter(store => 
                Object.values(store).some(value => 
                    String(value).toLowerCase().includes(term)
                )
            );
        }
        
        // Sort the results
        return [...filtered].sort((a, b) => {
            let valueA = a[sortColumn];
            let valueB = b[sortColumn];
            
            // Handle different data types
            if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }
            
            // Handle timestamp objects from Firebase
            if (valueA instanceof Object && valueA?.seconds) {
                valueA = valueA.seconds;
                valueB = valueB.seconds;
            }
            
            if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    // Helper function to get sort indicator
    function getSortIndicator(column) {
        if (sortColumn !== column) return '';
        return sortDirection === 'asc' ? '↑' : '↓';
    }

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

        getFilteredObjects();
    } catch (err) {
        console.error('Detailed error:', err);
        error = `Failed to fetch stores: ${err.message} (${err.code})`;
    }
    finally {
        loading = false;
    }};

    async function writeViaFunction(object) {
      const functionWrite = httpsCallable(func, 'updatestoresettings');
      functionWrite(object)
      .then((result) => {
          const data = result.data.message;  // This is the response from the function
          console.log(`Function reponse message: ${data}`);
      })
      .catch((error) => {
          // Getting the Error details.
          const code = error.code;
          const message = error.message;
          const details = error.details;
          console.error(`Error: ${code} - ${message}`);
          console.error(`Details: ${details}`);
      });
    }

    async function toggleChange(event) {
        try {
            const storeid = event.target.dataset.storeid;
            const newLSallowed = event.target.checked;

            //Triggering update Firebase Function
            const object = {storeid: storeid, LSallowed: newLSallowed};
            console.log(`Updating ${storeid} to ${newLSallowed} via functions`);
            await writeViaFunction(object)
            console.log(`----`);

            // const storeRef = doc(db, 'LSstore', storeid);
            // await updateDoc(storeRef, {LSallowed: newLSallowed, lastEdit: serverTimestamp(), user: $user.email});
            // console.log(`Updated ${storeid} to ${newLSallowed} via direct write`);

            logEvent(analytics, 'store_toggled', {
                storeid: storeid,
                toggled_to: newLSallowed,
              });

        // Optimistically update UI
            dbObjects = dbObjects.map(store => 
                store.storeid === storeid ? { ...store, LSallowed: newLSallowed,user: $user.email } : store
            );

            // Update filtered list as well
            getFilteredObjects(); 
        } catch (err) {
            console.error("Error updating Firestore:", err);
        }
    }

    // Use $effect to watch for changes in search term
    // $effect(() => {
    //     if (searchTerm !== undefined && !loading) {
    //         applyFilters();
    //     }
    // });

    onMount(fetchStores);

</script>

{#if loading}
    <div class="flex justify-center items-center h-64 g-3" >
        <div class="text-2xl pr-3">Loading</div><div class="loading loading-spinner loading-lg text-primary"></div>
      </div>
{:else}

<!-- New search input -->
<div class="mb-4">
  <input
      type="text"
      bind:value={searchTerm}
      placeholder="Search stores..."
      class="input input-bordered w-full max-w-xs"
  />
</div>

<div class="overflow-x-auto pt-5">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
            <th></th>
          <th class="cursor-pointer" onclick={() => sortData('storeid')}>StoreID</th>
          <th class="cursor-pointer" onclick={() => sortData('LSallowed')}>L&S Allowed</th>
          <th class="cursor-pointer" onclick={() => sortData('lastEdit')}>Last edited</th>
          <th class="cursor-pointer" onclick={() => sortData('user')}>Last edit by</th>
          <th>Change</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredObjects as storeObject}
          <tr>
            <th></th>
            <th>{storeObject.storeid}</th>
            <td>{storeObject.LSallowed}</td>
            <td>{storeObject.lastEdit}</td>
            <td>{storeObject.user}</td>
            <td><input type="checkbox" class="toggle" checked={storeObject.LSallowed} data-storeid={storeObject.storeid} onchange={toggleChange}/></td>
          </tr>
        {/each}
        {#if filteredObjects.length === 0}
                    <tr>
                        <td colspan="6" class="text-center py-4">No matching stores found</td>
                    </tr>
          {/if}
    </tbody>
    </table>
    </div>
{/if}