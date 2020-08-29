<script lang="ts">
  import Title from '../components/Title.svelte';

  export let title: string;
  export let hideButton: boolean = false;
</script>

<style>
  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    margin: 0 -0.75rem;
  }

  .title {
    margin: 0 0.75rem;
  }

  .title-button {
    flex-shrink: 0;
    padding: 0.25rem 0;
    display: flex;
    margin: 0 0.75rem 1.5rem;
  }
</style>

<div class="title-container">
  <div class="title">
    <Title>{title}</Title>
  </div>
  {#if !hideButton}
    <div class="title-button">
      <slot />
    </div>
  {/if}
</div>
