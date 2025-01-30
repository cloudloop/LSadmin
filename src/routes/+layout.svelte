<script>
	import AuthCheck from '$lib/AuthCheck.svelte';
	import Navbar from '$lib/Navbar.svelte';
import '../app.css';
	let { children } = $props();
</script>
	
<Navbar />
{@render children()}
