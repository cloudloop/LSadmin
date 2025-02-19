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
	import { app } from '$lib/firebase.js';

    // Get a reference to the functions
    const func = getFunctions(app, 'europe-north1');


    // Call the 'helloWorld' function and pass data
    function triggerFunction(){
        const helloWorldFunction = httpsCallable(func, 'helloworld');
        helloWorldFunction({ name: 'Axel', age: 30 })
        .then((result) => {
            const data = result.data;
            const sanitizedMessage = data.message;;  // This is the response from the function
            console.log(`Data: ${data}`);
            console.log(`Sanitized message: ${sanitizedMessage}`);
        })
        .catch((error) => {
            // Getting the Error details.
            const code = error.code;
            const message = error.message;
            const details = error.details;
            console.error(`Error: ${code} - ${message}`);
            console.error(`Details: ${details}`);
        });
    };

    
</script>

<button onclick={triggerFunction}>Trigger Firestore Function</button>


<Admin />