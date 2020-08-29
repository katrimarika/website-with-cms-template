<script lang="ts">
  import Button from '../components/Button.svelte';

  export let title: string = 'Close';
  export let close: () => void;
</script>

<style>
  .button-container {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.25rem;
  }
</style>

<div class="button-container">
  <Button styleType="light" icon="cross" {title} onClick={close} />
</div>
