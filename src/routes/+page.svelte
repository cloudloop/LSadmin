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

{#if $user}

    <h1>Welcome back, {user.displayName || 'Mysterious User'}!</h1>
    <p>Your email: {user.email}</p>

    <Logout />

    <slot />

{:else}
    <p class="text-error">
        You must be signed in to view this page.
        <a class="btn btn-primary" href="/login">Sign in</a>
    </p>
{/if}




  