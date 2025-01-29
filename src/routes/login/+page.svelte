<script>
    import { auth } from "$lib/firebase";
    import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
    import { goto } from '$app/navigation';

    let email = '';
    let password = '';
    let errorMessage = '';

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        console.log(user);
        goto('/');
    }

    async function signInWithEmail() {
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            console.log(user);
            goto('/');
        } catch (error) {
            console.error("Error signing in with email and password", error);
            errorMessage = "Error signing in: " + error.message;
        }
    }
</script>

<h2>Login</h2>

<form on:submit|preventDefault={signInWithEmail}>
    <div>
        <label for="email">Email:</label>
        <input type="email" id="email" bind:value={email} required>
    </div>
    <div>
        <label for="password">Password:</label>
        <input type="password" id="password" bind:value={password} required>
    </div>
    <button type="submit" class="btn btn-success">Sign in with Email</button>
</form>

{#if errorMessage}
    <p class="error">{errorMessage}</p>
{/if}

<button class="btn btn-primary" on:click={signInWithGoogle}>Sign in with Google</button>