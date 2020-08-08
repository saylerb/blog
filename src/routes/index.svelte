<script>
  import { fadeIn, fadeOut } from "../animate";
</script>

<style>
  h1 {
    font-size: 2.8em;
    text-transform: capitalize;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>Brian's Blog</title>
</svelte:head>

<div in:fadeIn out:fadeOut>
  <h1>Brian Sayler</h1>
</div>
