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
  export let segment;
  export let posts;
</script>

<style>
  .two-col {
    display: grid;
    grid-template-columns: 3fr 1fr;
  }
</style>

<main class="two-col">
  <div>
    <slot />
  </div>
  {#if segment}
    <aside>
      <h2>Post Archive</h2>
      <ul>
        {#each posts as post}
          <li>{post.title}</li>
        {/each}
      </ul>
    </aside>
  {/if}
</main>
