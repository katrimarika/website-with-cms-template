<script lang="ts">
  import type { File, Folder, FolderContent } from '../../utils/data';
  import Button from '../components/Button.svelte';
  import Icon from '../components/Icon.svelte';

  export let content: FolderContent;
  export let onItemClick: (f: File | Folder) => void;
  export let onPreview: (f: File) => void = undefined;
</script>

<style>
  ul {
    margin: 0;
    padding: 0;
  }

  li {
    margin-bottom: 0.75rem;
    list-style-type: none;
    display: flex;
    align-items: center;
  }

  button {
    font-family: var(--font-family);
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.3;
    display: flex;
    align-items: flex-start;
    width: 100%;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    padding: 0.75rem;
    text-align: start;
    word-break: break-word;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }

  button:hover,
  button:focus,
  button:active {
    box-shadow: inset 0 0 0 1px var(--border-color),
      1px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .icon-container {
    display: flex;
    align-items: center;
    margin: -0.125rem 0.5rem -0.125rem 0;
  }

  .select-container {
    margin-left: 0.75rem;
  }
</style>

<ul>
  {#each content as f (f.path)}
    <li>
      <button type="button" on:click={() => onItemClick(f)}>
        <span class="icon-container">
          <Icon
            icon={f.type === 'file' ? 'document' : 'folder_closed'}
            size="medium" />
        </span>
        <span>{f.name}</span>
      </button>
      {#if onPreview && f.type === 'file' && f.path.startsWith('images/')}
        <div class="select-container">
          <Button styleType="light" icon="zoom_in" onClick={() => onPreview(f)}>
            Show
          </Button>
        </div>
      {/if}
    </li>
  {:else}
    <li>No content</li>
  {/each}
</ul>
