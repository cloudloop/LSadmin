<script>
  // Main page component that handles user authentication state and displays appropriate content
    import Login from "$lib/Login.svelte";
    import {logout} from "$lib/Logout.js";
    import { getContext } from "svelte";
    
    // Get the user context from the layout
    const user = getContext("user");

    // Import global styles
    import "../app.css";
</script>

<!-- Conditional rendering based on authentication state-->
{#if $user}
    <!-- Display welcome message and logout button for authenticated users--> 
    <p>Welcome, {$user.uid}!</p>
    <button class="btn btn-success" onclick={logout}>Logout</button>
{:else}
    <!-- Show login component for unauthenticated users-->
    <Login />
{/if}