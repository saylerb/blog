<script context="module">
  import { fly } from "svelte/transition";
  export function preload({ params, query }) {
    return this.fetch(`blog.json`)
      .then((r) => r.json())
      .then((posts) => {
        return { posts };
      });
  }
</script>

<script>
  export let segment;
  export let posts;
</script>

<style>
  .two-col {
    display: grid;
    grid-template-columns: 3fr 1fr;
  }

  ul {
    list-style: none;
    padding-inline-start: 0;
  }
</style>

<main class="two-col">
  <div>
    <slot />
  </div>
  {#if segment}
    <aside transition:fly={{ x: 100 }}>
      <h2>Post Archive</h2>
      <ul>
        {#each posts as post}
          <li>
            <a rel="prefetch" href="blog/{post.slug}">
              {post.title} - {post.date}
            </a>
          </li>
        {/each}
      </ul>
    </aside>
  {/if}
</main>
