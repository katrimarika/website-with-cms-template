<script lang="ts">
  export let id: string;
  export let name: string = id;
  export let label: string;
  export let value: string = '';
  export let placeholder: string = undefined;
  export let disabled: boolean = undefined;
  export let required: boolean = undefined;
  export let errorMessage: string = undefined;

  export let onBlur: (
    e: FocusEvent & { currentTarget: HTMLTextAreaElement }
  ) => void = undefined;
</script>

<style>
  .container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    margin-bottom: 0.75rem;
    position: relative;
  }

  label {
    display: block;
    padding: 0.25rem 0;
  }

  label.required::after {
    content: ' *';
  }

  textarea {
    font-size: 1rem;
    width: 100%;
    flex-grow: 1;
    min-height: 20rem;
    resize: vertical;
    border: 1px solid var(--main-color);
    border-radius: 0.125rem;
    padding: 0.5rem;
    margin: 0.25rem 0;
    display: block;
  }

  textarea:not(:disabled):hover {
    box-shadow: inset 0 0 0 1px var(--highlight-color);
  }

  .error {
    border-color: #ca1919;
  }

  textarea:disabled {
    border-color: var(--border-color);
  }
</style>

<div class="container">
  <label for={id} class:required>{label}</label>
  <slot />
  <textarea
    {id}
    {name}
    {placeholder}
    aria-errormessage={errorMessage}
    bind:value
    {disabled}
    {required}
    on:blur={onBlur}
    class={errorMessage ? 'error' : undefined} />
</div>
