<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
    import {logout} from "$lib/Logout.js";

    let seachInput = $state("");
    function searchSearchBar(searchInput) {
        console.log(`Searching for ${seachInput}`);
    }
</script>

<div class="w-full">
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a href="/admin" class="btn btn-ghost text-xl">Lend and Sponsorship Admin Panel</a>
    </div>

    <div class="flex gap-2 md:gap-6">

        <div class="flex-none "> <!-- Search container -->
          <div class="form-control">
            <input 
              type="text" 
              placeholder="Search" 
              onkeyup="{searchSearchBar}" 
              class="input input-bordered w-24 md:w-auto" 
              bind:value={seachInput}
            />
          </div>
        </div>

          <div class="flex-none"> <!-- Avatar container -->
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                <div class="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>

              <ul
                tabindex="-1"
                class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a href="/" class="justify-between">Profile</a>
                </li>
                <li><a href="/">Settings</a></li>
                <li><button onclick={logout()}>Logout</button></li>
              </ul>
            </div>
          </div>
      </div>
  </div>
</div>