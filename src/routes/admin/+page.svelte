<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
    // In +layout.svelte
    import { browser } from '$app/environment';


    import { getContext } from 'svelte';
    const user = getContext("user");
    import { goto } from '$app/navigation';
	import ClaudeAdmin from '$lib/ClaudeAdmin.svelte';

    import Admin from '$lib/Admin.svelte';


    
    //Testing Firesstore HTTP Function
    import { getFunctions, httpsCallable } from "firebase/functions";

    // Get a reference to the functions
    const functions = getFunctions();


    // Call the 'helloWorld' function and pass data
    function triggerFunction(){
        const helloWorldFunction = httpsCallable(functions, 'helloWorld2');
        helloWorldFunction({ name: 'Axel', age: 30 })
        .then((result) => {
            console.log(result.data);  // This is the response from the function
        })
        .catch((error) => {
            console.error('Error calling function:', error);
        });
    };

    
</script>

<button onclick={triggerFunction}>Trigger Firestore Function</button>


<Admin />