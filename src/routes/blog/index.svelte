<script context="module">
  export function preload({ params, query }) {
    return this.fetch(`blog.json`)
      .then((r) => r.json())
      .then((posts) => {
        return { posts };
      });
  }
</script>

<script>
  import { fadeIn, fadeOut } from "../../animate";

  export let posts;
</script>

<style>
  ul {
    margin: 0 0 1em 0;
    line-height: 1.5;
  }
</style>

<svelte:head>
  <title>Blog</title>
</svelte:head>

<div in:fadeIn out:fadeOut>
  <h1>Posts</h1>

  <ul>
    {#each posts as post}
      <li>
        {#if !post.published}(Unpublished){/if}
        <a rel="prefetch" href="blog/{post.slug}">{post.title} - {post.date}</a>
      </li>
    {/each}
  </ul>
</div>
