<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
    import {onMount} from "svelte";

    import { logout } from '$lib/logout.js';
    import { goto } from '$app/navigation';

    onMount(() => {
        logout().then(() => {
            setTimeout(() => {
                goto('/');
            }, 500); // 3.5 seconds to match the typewriter effect duration
        });
    });
</script>


<p>Signing out.....</p>


