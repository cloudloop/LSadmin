<script>
    // Login page component that handles user authentication
	import Login from '$lib/Login.svelte';

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
</script>

<!-- Render the Login component which handles the authentication UI and logic-->
<Login />