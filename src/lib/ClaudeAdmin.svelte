<script>
    console.log(`ClaudeAdmin 1`);
    import { onMount } from 'svelte';
    import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
    import { db } from '$lib/firebase';
    import { flip } from 'svelte/animate';
    import { dndzone } from 'svelte-dnd-action';
    import { toast } from '@zerodevx/svelte-toast';

    // In your component
    import { browser } from '$app/environment';
  
    let allowedStores = [];
    let disallowedStores = [];
    let loading = true;
    let error = null;
    let searchAllowed = '';
    let searchDisallowed = '';
  
    //New fetchStores
    async function fetchStores() {
    try {
        loading = true;
        error = null;

        //Checking DB connection
        console.log(`${db}`);
        
        console.log('Starting fetch operation...');
         // Try to get a specific document first (if you know an ID)
        console.log(`Fetching single document...`);
        const singleDocRef = doc(db, 'allowed', 'SE1001');
        const singleDocSnap = await getDoc(singleDocRef);
        console.log('Single doc exists:', singleDocSnap.exists());
        console.log('Single doc data:', singleDocSnap.data());


        console.log(`Fetching whole DB`);
        const allowedRef = collection(db, 'allowed');
        console.log('Collection reference created');

        // Add this debug check
        console.log('Collection path:', allowedRef.path);
        
        const allowedSnapshot = await getDocs(allowedRef);
        console.log('Raw snapshot:', allowedSnapshot);
        console.log('Empty?:', allowedSnapshot.empty);

        if (allowedSnapshot.empty) {
            console.log('No documents found in collection');
            allowedStores = [];
            return;
        }

        console.log(`Fetched ${allowedSnapshot.size} documents`);
        
        allowedStores = allowedSnapshot.docs.map(doc => {
            const data = doc.data();
            console.log('Document data:', data);
            return {
                id: doc.id,
                storeid: data.storeid
            };
        });
        
        console.log('Fetch operation completed successfully');
    } catch (err) {
        console.error('Detailed error:', err);
        error = `Failed to fetch stores: ${err.message} (${err.code})`;
        toast.push({
            message: error,
            theme: {
                '--toastBackground': '#F87171',
                '--toastColor': 'white'
            }
        });
    } finally {
        loading = false;
    }
    }

    {
    // Fetch data from Firestore
    // async function fetchStores() {
    //   try {
    //     loading = true;
    //     error = null;
        
    //     console.log(`Fetching stores...`);
    //     const allowedSnapshot = await getDocs(collection(db, 'allowed'));
    //     //const disallowedSnapshot = await getDocs(collection(db, 'disallowed'));
    //     console.log(`${allowedSnapshot}`);
        
    //     console.log(`Mapping stores`);
    //     allowedStores = allowedSnapshot.docs.map(doc => ({
    //       id: doc.id,
    //       storeid: doc.data().storeid
    //     }));
        
    //     // disallowedStores = disallowedSnapshot.docs.map(doc => ({
    //     //   id: doc.id,
    //     //   storeid: doc.data().storeid
    //     // }));
    //   } catch (err) {
    //     error = 'Failed to fetch stores: ' + err.message;
    //     toast.push({
    //       message: error,
    //       theme: {
    //         '--toastBackground': '#F87171',
    //         '--toastColor': 'white'
    //       }
    //     });
    //   } finally {
    //     loading = false;
    //   }
    // }
    }
  
    // Update store status in Firestore
    async function updateStoreStatus(storeid, newStatus) {
      try {
        const docRef = doc(db, newStatus === 'allowed' ? 'allowed' : 'disallowed', storeid);
        await updateDoc(docRef, { status: newStatus });
        await fetchStores(); // Refresh the lists
        toast.push({
          message: `Store ${storeid} moved successfully`,
          theme: {
            '--toastBackground': '#34D399',
            '--toastColor': 'white'
          }
        });
      } catch (err) {
        error = 'Failed to update store status: ' + err.message;
        toast.push({
          message: error,
          theme: {
            '--toastBackground': '#F87171',
            '--toastColor': 'white'
          }
        });
      }
    }
  
    // DnD handlers
    function handleDndConsider(e) {
      const { items } = e.detail;
      if (e.currentTarget.dataset.list === 'allowed') {
        allowedStores = items;
      } else {
        disallowedStores = items;
      }
    }
  
    function handleDndFinalize(e) {
      const { items } = e.detail;
      if (e.currentTarget.dataset.list === 'allowed') {
        allowedStores = items;
      } else {
        disallowedStores = items;
      }
      // Update Firestore
      items.forEach(item => updateStoreStatus(item.storeid, e.currentTarget.dataset.list));
    }
  
    // Filter stores based on search
    $: filteredAllowed = allowedStores.filter(store => 
      store.storeid.toLowerCase().includes(searchAllowed.toLowerCase())
    );
    $: filteredDisallowed = disallowedStores.filter(store => 
      store.storeid.toLowerCase().includes(searchDisallowed.toLowerCase())
    );
  
    onMount(() => {
        if (browser) {
            fetchStores();
        }  
    });
  </script>
  
  <!-- Version 1: Drag and Drop -->
  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="loading loading-spinner loading-lg text-primary"></div>
    </div>
  {:else}
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-6">L&S - Drag and Drop Version</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Allowed Stores -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title text-success">Allowed Stores ({allowedStores.length})</h3>
            <div
              class="min-h-[200px] p-4 bg-base-200 rounded-lg"
              use:dndzone={{items: allowedStores}}
              data-list="allowed"
              on:consider={handleDndConsider}
              on:finalize={handleDndFinalize}
            >
              {#each allowedStores as store (store.storeid)}
                <div
                  animate:flip
                  class="p-3 mb-2 bg-success text-white rounded-lg cursor-move hover:bg-success-focus"
                >
                  {store.storeid}
                </div>
              {/each}
            </div>
          </div>
        </div>
  
        <!-- Disallowed Stores -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title text-error">Disallowed Stores ({disallowedStores.length})</h3>
            <div
              class="min-h-[200px] p-4 bg-base-200 rounded-lg"
              use:dndzone={{items: disallowedStores}}
              data-list="disallowed"
              on:consider={handleDndConsider}
              on:finalize={handleDndFinalize}
            >
              {#each disallowedStores as store (store.id)}
                <div
                  animate:flip
                  class="p-3 mb-2 bg-error text-white rounded-lg cursor-move hover:bg-error-focus"
                >
                  {store.storeid}
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Version 2: Search and Button Transfer -->
  <div class="p-4 mt-8">
    <h2 class="text-2xl font-bold mb-6">L&S - Search Version</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Allowed Stores -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title text-success">Allowed Stores ({allowedStores.length})</h3>
          <div class="form-control">
            <input
              type="text"
              placeholder="Search allowed stores..."
              class="input input-bordered w-full"
              bind:value={searchAllowed}
            />
          </div>
          <div class="h-[400px] overflow-y-auto mt-4">
            <!-- {#each filteredAllowed as store (store.id)}
              <div class="flex justify-between items-center p-3 mb-2 bg-base-200 rounded-lg">
                <span>{store.storeid}</span>
                <button
                  class="btn btn-error btn-sm"
                  on:click={() => updateStoreStatus(store.storeid, 'disallowed')}
                >
                  Move to Disallowed
                </button>
              </div>
            {/each} -->
          </div>
        </div>
      </div>
  
      <!-- Disallowed Stores -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title text-error">Disallowed Stores ({disallowedStores.length})</h3>
          <div class="form-control">
            <input
              type="text"
              placeholder="Search disallowed stores..."
              class="input input-bordered w-full"
              bind:value={searchDisallowed}
            />
          </div>
          <div class="h-[400px] overflow-y-auto mt-4">
            <!-- {#each filteredDisallowed as store (store.id)}
              <div class="flex justify-between items-center p-3 mb-2 bg-base-200 rounded-lg">
                <span>{store.storeid}</span>
                <button
                  class="btn btn-success btn-sm"
                  on:click={() => updateStoreStatus(store.storeid, 'allowed')}
                >
                  Move to Allowed
                </button>
              </div>
            {/each} -->
          </div>
        </div>
      </div>
    </div>
  </div>