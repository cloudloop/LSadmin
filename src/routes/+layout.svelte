<script>
    import '../app.css';
    let { children } = $props();

    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { writable } from "svelte/store";
    import { setContext } from "svelte";
	import Login from "../lib/Login.svelte";
    import "../lib/firebase";
	import Navbar from '$lib/Navbar.svelte';
    import ThemeSwitcher from '$lib/ThemeSwitcher.svelte';

    const auth = getAuth();
    export const user = writable(null);

    // Set up auth listener immediately, not waiting for mount
    onAuthStateChanged(auth, (firebaseUser) => {
        user.set(firebaseUser);
        // console.log(firebaseUser 
        //     ? `User is authenticated: ${firebaseUser.uid}`
        //     : 'User is not authenticated'
        // );
    });

    // Set context immediately
    setContext("user", user);

    
</script>

{#if !$user}
	<Login />
{:else}
	{#if $user}
		{@render children()}
	{/if}
{/if}

<ThemeSwitcher />
		


