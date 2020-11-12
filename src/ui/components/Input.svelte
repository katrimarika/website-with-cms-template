<script lang="ts">
  export let id: string;
  export let name: string = id;
  export let label: string;
  export let type = 'text';
  export let value: string = '';
  export let placeholder: string = undefined;
  export let disabled: boolean = undefined;
  export let required: boolean = undefined;
  export let autocomplete: string = undefined;
  export let errorMessage: string = undefined;
  export let suffix: string = undefined;
  export let inputModifier: (s: string) => string = (s) => s;
</script>

<style>
  .container {
    margin-bottom: 0.75rem;
  }

  label {
    display: block;
    padding: 0.25rem 0;
  }

  label.required::after {
    content: ' *';
  }

  .input-container {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    margin: 0.25rem 0;
  }

  input {
    font-size: 1rem;
    display: block;
    padding: 0.5rem;
    width: 100%;
    border: 1px solid var(--main-color);
    border-radius: 0.125rem;
    line-height: 1.5;
  }

  input:not(:disabled):hover {
    box-shadow: inset 0 0 0 1px var(--highlight-color);
  }

  .error {
    border-color: #ca1919;
  }

  input:disabled {
    border-color: var(--border-color);
  }

  span {
    margin-left: 0.25rem;
  }

  @media (min-width: 768px) {
    .container {
      display: flex;
      justify-content: stretch;
      align-items: center;
    }

    label {
      flex: 0 0 6rem;
      min-width: 6rem;
      margin-right: 1rem;
    }

    .input-container {
      max-width: 20rem;
    }
  }
</style>

<div class="container">
  <label for={id} class:required>{label}</label>
  <div class="input-container">
    <input
      {id}
      {name}
      {type}
      {placeholder}
      {autocomplete}
      aria-errormessage={errorMessage}
      on:input={(e) => {
        const newVal = inputModifier(e.currentTarget.value);
        value = newVal;
        if (newVal !== e.currentTarget.value) {
          e.currentTarget.value = newVal;
        }
      }}
      {value}
      {disabled}
      {required}
      class={errorMessage ? 'error' : undefined} />
    {#if suffix}
      <span>{suffix}</span>
    {/if}
  </div>
</div>
