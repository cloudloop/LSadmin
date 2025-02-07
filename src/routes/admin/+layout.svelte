<script>
	import Navbar from '$lib/Navbar.svelte';

    /** @type {{ data: import('./$types').LayoutData, children: import('svelte').Snippet }} */
    let { data, children } = $props();

    import { getContext } from 'svelte';
    const user = getContext("user");
</script>

{#if !$user}
    <Login />
{:else}
    <Navbar />
    {@render children()}
{/if}
