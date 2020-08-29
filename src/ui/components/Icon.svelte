<script lang="ts">
  export let icon: string;
  export let size: 'small' | 'medium' = 'small';
</script>

<style>
  img {
    display: inline-block;
    height: 1.125rem;
    width: 1.125rem;
  }

  .medium {
    height: 1.5rem;
    width: 1.5rem;
  }
</style>

<img aria-hidden={true} alt="" src={`assets/${icon}.svg`} class={size} />
