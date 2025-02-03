<script>
    import { auth } from "$lib/firebase.js";
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { writable } from "svelte/store";
    import { goto } from "$app/navigation";
  
    let email = "";
    let password = "";
    let loading = writable(false);
    let error = writable("");
  
    const login = async () => {
        event.preventDefault() //Prevents page reload which is automatic in HTML
      error.set(""); // Reset error message
      loading.set(true);
  
      try {
        await signInWithEmailAndPassword(auth, email, password);
        //location.reload(); // ✅ Reload the page after successful login
        goto("/admin"); // ✅ Redirect to another page
      } catch (err) {
        error.set(err.message);
      } finally {
        loading.set(false);
      }
    };
  </script>
  
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 w-96">
      <h2 class="text-2xl font-semibold text-center text-gray-700">Login</h2>
  
      <!-- Error Message -->
      {#if $error}
        <p class="mt-2 text-red-500 text-sm text-center">{$error}</p>
      {/if}
  
      <!-- Input Fields -->
        <form onsubmit={login}>
            <div class="mt-4">
                <label for="email" class="block text-sm font-medium text-gray-600">Email</label>
                <input
                id="email"
                type="email"
                bind:value={email}
                class="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-indigo-300 bg-gray-100 text-black" 
                placeholder="Enter your email"
                />
            </div>
        
            <div class="mt-4">
                <label for="password" class="block text-sm font-medium text-gray-600">Password</label>
                <input
                    id="password"
                type="password"
                bind:value={password}
                class="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-indigo-300 bg-gray-100 text-black"
                placeholder="Enter your password"
                />
            </div>
        
            <!-- Submit Button -->
            <button
                class="mt-6 w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                onclick={login}
                disabled={$loading}
                type="submit">
                {#if $loading} Logging in... {/if}
                {#if !$loading} Login {/if}
            </button>
        </form>
    </div>
  </div>

  
