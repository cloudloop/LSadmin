<script>
    import Login from "$lib/Login.svelte";
    import {logout} from "$lib/Logout.js";
    import { getContext } from "svelte";
    
    const user = getContext("user");
  </script>
  
  {#if $user}
    <p>Welcome, {$user.uid}!</p>
    <button class="btn btn-success" onclick={logout}>Logout</button>
  {:else}
    <Login />
  {/if}