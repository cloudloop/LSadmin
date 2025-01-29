<script>
    import { page } from '$app/stores';
</script>

<h1>{$page.status}: {$page.error.message}</h1>

<p>Ohhh.. Something went really bad. Try again!</p>

<a href="/"><button class="btn btn-success">Go back!</button></a>