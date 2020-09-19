<script>
  import { stores } from "@sapper/app";
  import Nav from "../components/Nav.svelte";
  import NProgress from "nprogress";
  import "nprogress/nprogress.css";

  export let segment;

  NProgress.configure({
    // More NProgress configuration here: https://github.com/rstacruz/nprogress#configuration
    minimum: 0.16,
    showSpinner: true,
    parent: "main",
  });

  const { preloading } = stores();

  $: {
    if ($preloading) {
      NProgress.start();
    }

    if (!$preloading) {
      NProgress.done();
    }
  }
</script>

<style>
  div {
    position: relative;
    max-width: 56em;
    background-color: white;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>

<Nav {segment} />

<main>
  <div class="content">
    <slot />
  </div>
</main>
