<script lang="ts">
  export let loading: boolean = false;
  export let small: boolean = undefined;
  export let grow: boolean = undefined;
</script>

<style>
  .wrapper {
    position: relative;
    min-height: 5rem;
  }

  .wrapper.small {
    min-height: 1.125rem;
  }

  .grow {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .dimmer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--inverse-color);
    opacity: 0.5;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .spinner {
    position: absolute;
    top: calc(50% - 2rem);
    left: calc(50% - 2rem);
    height: 4rem;
    width: 4rem;
    border: 0.5rem dotted var(--highlight-color);
    border-radius: 4rem;
    border-top-color: transparent;
    animation: 1.5s linear infinite rotate;
  }

  .spinner.small {
    top: calc(50% - 0.5rem);
    left: calc(50% - 0.5rem);
    height: 1rem;
    width: 1rem;
    border-width: 0.125rem;
  }
</style>

<div class="wrapper" class:small class:grow>
  <slot />
  {#if loading}
    <div class="dimmer" />
    <div class="spinner" class:small />
  {/if}
</div>
