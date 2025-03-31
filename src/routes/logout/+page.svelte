<!-- Logout page component that handles user sign-out and redirects to home page-->
<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
    import {onMount} from "svelte";

    // Import logout functionality and navigation utilities
    import { logout } from '$lib/logout.js';
    import { goto } from '$app/navigation';

    // Execute logout process when component mounts
    onMount(() => {
        logout().then(() => {
            // Redirect to home page after successful logout
            setTimeout(() => {
                goto('/');
            }, 500); // Short delay to show the signing out message
        });
    });
</script>

<!-- Display message while logout is in progress-->
<p>Signing out.....</p>


