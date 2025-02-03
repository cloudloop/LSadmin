<script>
	import Login from '$lib/Login.svelte';

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
</script>

<Login />