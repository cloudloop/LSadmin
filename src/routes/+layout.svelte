<script>
	import '../app.css';
	let { children } = $props();

	import { onMount } from "svelte";
	import { getAuth, onAuthStateChanged } from "firebase/auth";
	import { writable } from "svelte/store";
	import { setContext } from "svelte";
	import "../lib/firebase"; // Ensure Firebase is initialized here

	// Create a writable store for user state
	export const user = writable(null);

	onMount(() => {
		const auth = getAuth();
		
		// Listen for authentication state changes
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
		if (firebaseUser) {
			user.set(firebaseUser); // firebaseUser is provided by Firebase Auth
			console.log('User is authenticated:', firebaseUser.uid);
		} else {
			user.set(null);
			console.log('User is not authenticated');
		}
		});

		// Cleanup subscription on component unmount
		return () => unsubscribe();
	});

	// Provide user state globally
	setContext("user", user);
</script>
		
{@render children()}

