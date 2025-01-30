<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { form } = $props();

    import {user} from "$lib/firebase";
    import { onMount } from 'svelte';
    
    let storeId = $state(''); // storeId is a string


    import { enhance } from '@sveltejs/kit';


    function beforeSubmit({ data, form }) {
    // e.g., do some extra client-side checks or augment form data
    console.log('About to submit', data);
  }

  function afterSubmit({ data, form }) {
    // Runs after the server returns, data is what the server action returned
    console.log('Server response:', data);
  }

    // import { getFirestore, collection, addDoc } from "firebase/firestore";
    // const db = getFirestore();

    // async function handleSubmit() {
    //     if (storeId.match(/^[A-Z]{2}[0-9]{4}$/)) {
    //         try {
    //             await addDoc(collection(db, "approved"), {
    //                 storeID: storeId,
    //                 LS: true
    //             });
    //             console.log('Store ID submitted:', storeId);
    //         } catch (e) {
    //             console.error("Error adding document: ", e);
    //         }
    //     } else {
    //         alert('Invalid Store ID format. Please use the format XY0123.');
    //     }
    // }
</script>

<!-- <form onsubmit|preventDefault={handleSubmit}>
    <label for="storeId">Store ID:</label>
    <input type="text" id="storeId" bind:value={storeId} pattern="[A-Z]{2}[0-9]{4}" required>
    <button type="submit">Add Store ID</button>
</form> -->

<form method="post" use:enhance={{ beforeSubmit, afterSubmit }}>
    <label for="storeId">Store ID:</label>
    <input type="text" id="storeId" bind:value={storeId} pattern="[A-Z]{2}[0-9]{4}" required>
    <button type="submit">Add Store ID</button>
  </form>

  {#if form?.error}
  <p style="color: red;">{form.error}</p>
    {/if}
    {#if form?.success}
    <p style="color: green;">Form submitted successfully!</p>
    {/if}
