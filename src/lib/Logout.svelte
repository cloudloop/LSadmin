<script>
    import { getAuth, signOut } from "firebase/auth";

    const auth = getAuth();

    function logout() {
        signOut(auth).then(() => {
            console.log('User signed out');
        }).catch((error) => {
            console.error('Sign out error', error);
        });
    }
</script>

<button class="btn btn-accent" onclick={logout}>Logout</button>