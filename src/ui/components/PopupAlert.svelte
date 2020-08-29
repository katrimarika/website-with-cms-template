<script lang="ts">
  import Button from './Button.svelte';
  import PopupWrapper from './PopupWrapper.svelte';
  import Title from './Title.svelte';

  export let title: string = undefined;
  export let message: string;
  export let close: () => void;
</script>

<style>
  .dialog {
    background: var(--inverse-color);
    box-shadow: 1px 4px 8px rgba(0, 0, 0, 0.4);
    border-radius: 0.25rem;
    overflow: hidden;
    padding: 1.5rem;
    min-width: 20rem;
    max-width: 95vw;
    margin-bottom: 2.5rem;
  }

  pre {
    font-family: var(--code-font-family);
    line-height: 1.2;
    margin: 0.5rem 0 2rem;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (min-width: 768px) {
    .dialog {
      max-width: 35rem;
    }
  }
</style>

<PopupWrapper {close} label={title || 'Alert'} describedBy="alert-message">
  <div class="dialog">
    {#if title}
      <Title>{title}</Title>
    {/if}
    <pre id="alert-message">{message}</pre>
    <div class="button-container">
      <slot>
        <Button onClick={close}>Ok</Button>
      </slot>
    </div>
  </div>
</PopupWrapper>
