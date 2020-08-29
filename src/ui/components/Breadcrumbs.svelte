<script lang="ts">
  import type { File, Folder } from '../../utils/data';
  import { goToItem, goToRoot } from '../../utils/route';
  import Button from '../components/Button.svelte';

  export let path: string;
  export let onItemSelect: (item: File | Folder) => void = undefined;

  $: parts = path.split('/');

  function onClickFn(name: string, index: number) {
    return () => {
      const newPath = parts.slice(0, index + 1).join('/');
      const item = { name, path: newPath, type: 'dir' as const };
      if (onItemSelect) {
        onItemSelect(item);
      } else {
        goToItem(item);
      }
    };
  }
</script>

<style>
  .breadcrumbs {
    margin-bottom: 0.75rem;
  }

  @media (min-width: 768px) {
    .breadcrumbs {
      margin-top: 0.125rem;
    }
  }
</style>

<div class="breadcrumbs">
  {#if !onItemSelect}
    <Button styleType="extra-light" onClick={goToRoot}>
      <small>Root</small>
    </Button>
  {/if}
  {#each parts as part, index}
    {#if !onItemSelect || index > 0}
      <span>{index !== 0 ? '\u00a0' : ''}/</span>
    {/if}
    {#if index < parts.length - 1}
      <Button styleType="extra-light" onClick={onClickFn(part, index)}>
        <small>{part}</small>
      </Button>
    {:else if part}
      <span>
        <small>{part}</small>
      </span>
    {/if}
  {/each}
</div>
