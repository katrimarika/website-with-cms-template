<script lang="ts">
  import Icon from './Icon.svelte';

  export let type: string = 'button';
  export let onClick: () => void = undefined;
  export let styleType:
    | 'default'
    | 'outline'
    | 'light'
    | 'extra-light'
    | 'danger' = 'default';
  export let icon: string = undefined;
  export let title: string = undefined;
  export let disabled: boolean = undefined;
  export let grow: boolean = undefined;
  export let alignStart: boolean = undefined;
  export let style: string = undefined;

  const empty = !$$props.$$slots;
</script>

<style>
  button {
    font-family: var(--font-family);
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.2;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    text-align: start;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }

  .grow {
    width: 100%;
  }

  .alignStart {
    justify-content: flex-start;
  }

  .default,
  .outline {
    background-color: var(--highlight-color);
    color: var(--inverse-color);
    padding: 0.75rem 1rem;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--highlight-color);
  }

  .outline {
    background-color: white;
    color: var(--highlight-color);
  }

  .light,
  .extra-light,
  .danger {
    background: none;
    padding: 0.0625rem;
    margin: -0.0625rem;
  }

  .light,
  .extra-light {
    color: var(--main-color);
  }

  .extra-light {
    font-weight: 300;
  }

  .danger {
    color: var(--danger-color);
  }

  button:not(:disabled):hover,
  button:not(:disabled):focus,
  button:not(:disabled):active {
    opacity: 0.85;
  }

  .icon-container {
    display: flex;
    align-items: center;
    margin-right: 0.375rem;
  }

  .empty {
    margin-right: 0;
  }
</style>

<button
  {type}
  on:click={onClick}
  class={styleType}
  class:grow
  class:alignStart
  {title}
  {disabled}
  {style}>
  {#if icon}
    <span class="icon-container" class:empty>
      <Icon {icon} size={empty ? 'medium' : 'small'} />
    </span>
  {/if}
  <slot />
</button>
