<script>

	import { goto } from '$app/navigation';
	import Navbar from '$lib/Navbar.svelte';
    import {browser} from '$app/environment';

    import { getContext } from "svelte";
    const user = getContext("user");

	// If user is not logged in, redirect or show 403
    if (browser) {
            if (!user) {
                goto('/login');
            }
        };

</script>

<Navbar />

<slot />
