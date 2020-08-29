<script lang="ts">
  export let id: string;
  export let name: string = id;
  export let label: string;
  export let value: string = '';
  export let options: string[];
  export let disabled: boolean = undefined;
  export let required: boolean = undefined;
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

  select {
    font-size: 1rem;
    display: block;
    padding: 0.5rem 2rem 0.5rem 0.5rem;
    width: 100%;
    border: 1px solid var(--main-color);
    border-radius: 0.125rem;
    margin: 0.25rem 0;
    line-height: 1.5;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background: url('assets/chevron_down.svg') no-repeat right 0.5rem center;
    background-size: 1.5rem;
  }

  select:not(:disabled):hover {
    box-shadow: inset 0 0 0 1px var(--highlight-color);
  }

  select:disabled {
    border-color: var(--border-color);
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

    select {
      max-width: 20rem;
    }
  }
</style>

<div class="container">
  <label for={id} class:required>{label}</label>
  <select {id} {name} bind:value {required} {disabled}>
    {#each options as option}
      <option value={option}>{option}</option>
    {/each}
  </select>
</div>
