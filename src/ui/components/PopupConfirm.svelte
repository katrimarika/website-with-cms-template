<script lang="ts">
  import Button from './Button.svelte';
  import PopupAlert from './PopupAlert.svelte';

  export let message: string;
  export let close: () => void;
  export let onConfirm: () => void;

  function confirm() {
    onConfirm();
    close();
  }
</script>

<style>
  .button-container {
    margin-right: 1rem;
  }
</style>

<PopupAlert title="Confirm" {message} {close}>
  <div class="button-container">
    <Button onClick={confirm}>Yes</Button>
  </div>
  <Button styleType="outline" onClick={close}>No</Button>
</PopupAlert>
