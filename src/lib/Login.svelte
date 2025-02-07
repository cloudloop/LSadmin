<script>
    import { auth } from "$lib/firebase.js";
    import { signInWithEmailAndPassword , GoogleAuthProvider, signInWithPopup, OAuthProvider} from "firebase/auth";
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

    const googleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
          await signInWithPopup(auth, provider);
          goto("/admin");
        } catch (err) {
          error.set(err.message);
        } finally {
        loading.set(false);
      }
      };

      const microsoftLogin = async () => {
        const provider = new OAuthProvider('microsoft.com')
        try {
          await signInWithPopup(auth, provider)
            .then((result) => {
            // User is signed in.
            // IdP data available in result.additionalUserInfo.profile.

            // Get the OAuth access token and ID Token
            const credential = OAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            const idToken = credential.idToken;
            })
          goto("/admin");
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
        <div class="inline-flex items-center justify-center w-full">
          <hr class="w-64 h-px my-6 bg-gray-200 border-0 dark:bg-gray-700">
          <span class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2">or</span>
      </div>

        <!--light-rectangular-->
        <div class="flex items-center justify-center space-x-2">
            <button
            onclick={googleLogin}
            aria-label="Sign in with Google"
            class="flex items-center bg-white border border-solid border-button-border-light rounded-md p-0.5 pr-3"
            >
            <div class="flex items-center justify-center bg-white w-9 h-9 rounded-l">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
                <title>Sign in with Google</title>
                <desc>Google G Logo</desc>
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  class="fill-google-logo-blue"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  class="fill-google-logo-green"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  class="fill-google-logo-yellow"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  class="fill-google-logo-red"
                ></path>
              </svg>
            </div>
            <span class="text-sm text-google-text-gray tracking-wider">Sign in with Google</span>
            </button>

          </div>
    </div>
  </div>

  
