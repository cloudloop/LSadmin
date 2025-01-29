<script>
	import AuthCheck from "$lib/AuthCheck.svelte";
	import Logout from "$lib/Logout.svelte";
    import { user } from "$lib/firebase";
    
    if (user) {
        // console.log('User object:', user);

        // // Example usage:
        // console.log('UID:', user.emailVerified);
        // console.log('Email:', user.metadata);
    }

</script>


<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>


<AuthCheck>

    <h1>Welcome back, {user.displayName || 'Mysterious User'}!</h1>
    <p>Your email: {user.email}</p>

    <Logout />

</AuthCheck>

<p>CAn you see the secret text above?</p>