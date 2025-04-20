<!-- Admin page component that provides administrative functionality and Firebase function testing-->
<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
    // In +layout.svelte
    import { browser } from '$app/environment';

    // Get user context for authentication
    import { getContext } from 'svelte';
    const user = getContext("user");
    import { goto } from '$app/navigation';
	import ClaudeAdmin from '$lib/ClaudeAdmin.svelte';

    import Admin from '$lib/Admin.svelte';

    // Firebase Functions setup for testing
    import { getFunctions, httpsCallable } from "firebase/functions";
	import { app } from '$lib/firebase.js';

    // Initialize Firebase Functions with specific region
    const func = getFunctions(app, 'europe-north1');

    // Function to test Firebase Cloud Function
    function triggerFunction(){
        const helloWorldFunction = httpsCallable(func, 'helloworld');
        helloWorldFunction({ name: 'Axel', age: 30 })
        .then((result) => {
            const data = result.data;
            const sanitizedMessage = data.message;  // This is the response from the function
            console.log(`Data: ${data}`);
            console.log(`Sanitized message: ${sanitizedMessage}`);
        })
        .catch((error) => {
            // Error handling for Firebase function calls
            const code = error.code;
            const message = error.message;
            const details = error.details;
            console.error(`Error: ${code} - ${message}`);
            console.error(`Details: ${details}`);
        });
    };
</script>

<!-- Test button for Firebase function-->
<button onclick={triggerFunction}>Trigger Firestore Function</button>

<!-- Render the main Admin component-->
<Admin />