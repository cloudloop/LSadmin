<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();

    // Import necessities
    import { getContext, onMount } from 'svelte';
    import { collection, getDocs, doc, serverTimestamp } from 'firebase/firestore';
    import { db } from '$lib/firebase'
    import { logEvent, getAnalytics } from "firebase/analytics";
    import { getFunctions, httpsCallable } from "firebase/functions";
    import { app } from '$lib/firebase.js';
    
    const analytics = getAnalytics();
    const func = getFunctions(app, 'europe-north1');

    //Import global user context to check login status
    const user = getContext("user");

    // State management using Svelte 5 runes
    let loading = $state(true);
    let error = $state(null);
    let dbObjects = $state([]);
    let searchTerm = $state('');
    let sortColumn = $state('storeid');
    let sortDirection = $state('asc');

    // Computed properties using $derived
    let filteredObjects = $derived.by(() => {
        // console.log('Computing filteredObjects');
        console.log('--------------------------------');
        console.log('dbObjects length:', dbObjects.length);
        console.log('searchTerm:', searchTerm);
        console.log('sortColumn:', sortColumn);
        // console.log('sortDirection:', sortDirection);

        if (!dbObjects.length) {
            console.log('No dbObjects, returning empty array');
            return [];
        }

        const term = searchTerm.toLowerCase().trim();
        let filtered = term 
            ? dbObjects.filter(store => 
                store.storeid.toLowerCase().includes(term)
            )
            : dbObjects;
        
        console.log('Filtered before sort:', filtered.length);
        
        return [...filtered].sort((a, b) => {
            let valueA = a[sortColumn];
            let valueB = b[sortColumn];
            
            // Handle boolean values
            if (sortColumn === 'LSallowed') {
                valueA = Boolean(valueA);
                valueB = Boolean(valueB);
            }
            // Handle string values
            else if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }
            
            if (valueA instanceof Object && valueA?.seconds) {
                valueA = valueA.seconds;
                valueB = valueB.seconds;
            }
            
            if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    });

    // Debug effect
    $effect(() => {
        console.log('Effect triggered - filteredObjects length:', filteredObjects.length);
    });

    // Format timestamp for display
    function formatTimestamp(timestamp) {
        if (!timestamp || !timestamp.seconds) return '';
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleString();
    }

    // Optimized sort handler with debouncing
    let sortTimeout;
    function sortData(column) {
        clearTimeout(sortTimeout);
        sortTimeout = setTimeout(() => {
            if (sortColumn === column) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                sortDirection = 'asc';
            }
        }, 50);
    }

    // Fetch function with error handling and loading states
    async function fetchStores() {
        try {
            loading = true;
            error = null;
            console.log('Fetching stores...');
            const allowedRef = collection(db, 'LSstore');
            const dbResponse = await getDocs(allowedRef);
            const fetchedData = dbResponse.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            console.log(`Fetched ${fetchedData.length} stores`);
            console.log('Sample store data:', fetchedData[0]); // Log first store to check structure
            dbObjects = fetchedData;
            console.log('dbObjects length after fetch:', dbObjects.length);
        } catch (err) {
            console.error('Detailed error:', err);
            error = `Failed to fetch stores: ${err.message} (${err.code})`;
        } finally {
            loading = false;
        }
    }

    // Ensure data is loaded before component is mounted
    onMount(async () => {
        await fetchStores();
    });

    // Optimized toggle handler with optimistic updates
    async function toggleChange(event) {
        const storeid = event.target.dataset.storeid;
        const newLSallowed = event.target.checked;

        // Optimistic update
        dbObjects = dbObjects.map(store => 
            store.storeid === storeid 
                ? { ...store, LSallowed: newLSallowed, user: $user.email } 
                : store
        );

        try {
            const object = { storeid, LSallowed: newLSallowed };
            await writeViaFunction(object);

            logEvent(analytics, 'store_toggled', {
                storeid,
                toggled_to: newLSallowed,
            });
        } catch (err) {
            // Revert on error
            dbObjects = dbObjects.map(store => 
                store.storeid === storeid 
                    ? { ...store, LSallowed: !newLSallowed } 
                    : store
            );
            console.error("Error updating Firestore:", err);
        }
    }

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
</script>

{#if loading}
    <div class="flex justify-center items-center h-64">
        <div class="text-2xl pr-3">Loading stores...</div>
        <div class="loading loading-spinner loading-lg text-primary"></div>
    </div>
{:else if error}
    <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
    </div>
{:else}
    <!-- Search and controls -->
    <div class="mb-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <input
            type="text"
            bind:value={searchTerm}
            placeholder="Search stores..."
            class="input input-bordered w-full max-w-xs"
        />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
        <table class="table">
            <thead>
                <tr>
                    <th></th>
                    <th class="cursor-pointer hover:bg-base-200" onclick={() => sortData('storeid')}>
                        StoreID {#if sortColumn === 'storeid'}{sortDirection === 'asc' ? '↑' : '↓'}{/if}
                    </th>
                    <th class="cursor-pointer hover:bg-base-200" onclick={() => sortData('LSallowed')}>
                        L&S Allowed {#if sortColumn === 'LSallowed'}{sortDirection === 'asc' ? '↑' : '↓'}{/if}
                    </th>
                    <th class="cursor-pointer hover:bg-base-200" onclick={() => sortData('lastEdit')}>
                        Last edited {#if sortColumn === 'lastEdit'}{sortDirection === 'asc' ? '↑' : '↓'}{/if}
                    </th>
                    <th class="cursor-pointer hover:bg-base-200" onclick={() => sortData('user')}>
                        Last edit by {#if sortColumn === 'user'}{sortDirection === 'asc' ? '↑' : '↓'}{/if}
                    </th>
                    <th>Change</th>
                </tr>
            </thead>
            <tbody>
                {#each filteredObjects as storeObject}
                    <tr>
                        <th></th>
                        <th>{storeObject.storeid}</th>
                        <td>{storeObject.LSallowed}</td>
                        <td>{formatTimestamp(storeObject.lastEdit)}</td>
                        <td>{storeObject.user}</td>
                        <td>
                            <input 
                                type="checkbox" 
                                class="toggle" 
                                checked={storeObject.LSallowed} 
                                data-storeid={storeObject.storeid} 
                                onchange={toggleChange}
                            />
                        </td>
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