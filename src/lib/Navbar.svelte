<script>
	import { goto } from '$app/navigation';
	import { user } from './firebase';
    import { getAuth, signOut } from 'firebase/auth';
    import { onMount } from 'svelte';

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();

    const auth = getAuth();

    function logout() {
        signOut(auth).then(() => {
            console.log('User signed out');
            goto('/');
        }).catch((error) => {
            console.error('Sign out error', error);
        });
    }

</script>

<div class="navbar bg-base-100">
    <div class="flex-1">
      <a href="/" class="btn btn-ghost text-xl">Lend & Sponsoring Admin Panel</a>
    </div>
    <div class="flex-none gap-2">
      <div class="form-control">
        <input type="text" placeholder="Search" class="input input-bordered w-24 md:w-auto" />
      </div>
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>
        <ul tabindex="-1" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          {#if $user}
            <li>
                <a href="/profile" class="justify-between">
                Profile
                </a>
            </li>
          <li><a href="/">Settings</a></li>
          <li><button onclick={logout}>Logout</button></li>
          {/if}
        {#if !$user}
            <li><a href="/login">Login</a></li>
        {/if}
        </ul>
      </div>
    </div>
  </div>