<script lang="ts">
  export let id: string = undefined;
  export let name: string = id;
  export let label: string;
  export let checked: boolean;
  export let disabled: boolean = undefined;
</script>

<style>
  label {
    position: relative;
    margin: 0.25rem 0 1rem;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }

  .checkbox {
    padding: 0.625rem;
    border: 1px solid var(--main-color);
    border-radius: 0.125rem;
    margin-right: 0.5rem;
  }

  span {
    display: block;
    padding: 0.25rem 0;
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  input:disabled ~ .checkbox {
    border-color: var(--border-color);
    background: transparent;
  }

  input:focus ~ .checkbox {
    outline: 1px auto var(--border-color);
  }

  label:hover input:not(:disabled) ~ .checkbox {
    box-shadow: inset 0 0 0 1px var(--highlight-color);
  }

  input:checked ~ .checkbox:after {
    content: '';
    display: block;
    position: absolute;
    left: 0.4375rem;
    top: 0.3125rem;
    width: 0.3125rem;
    height: 0.6875rem;
    border: solid var(--main-color);
    border-width: 0 0.1875rem 0.1875rem 0;
    transform: rotate(45deg);
  }

  @media (min-width: 768px) {
    label {
      margin-left: 7rem;
    }
  }
</style>

<label>
  <input {id} {name} type="checkbox" bind:checked {disabled} />
  <div class="checkbox" />
  <span>{label}</span>
</label>
