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


	// If user is not logged in, redirect or show 403
    
   
	



    
</script>


<Admin />