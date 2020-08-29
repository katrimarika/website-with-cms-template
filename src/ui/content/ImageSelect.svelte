<script lang="ts">
  import type { File, Folder } from '../../utils/data';
  import PopupWrapper from '../components/PopupWrapper.svelte';
  import FolderContent from './FolderContent.svelte';

  export let onSelect: (name: string, path: string) => void;
  export let close: () => void;

  let folder: Folder = { name: 'images', path: 'images', type: 'dir' };

  function onItemSelect(f: File | Folder) {
    if (f.type === 'file') {
      onSelect(f.name, f.path);
      close();
    } else {
      folder = f;
    }
  }
</script>

<style>
  .dialog {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 90rem;
    max-width: 95vw;
    min-height: 20rem;
    max-height: 95vh;
    background: var(--inverse-color);
    box-shadow: 1px 4px 8px rgba(0, 0, 0, 0.4);
    border-radius: 0.25rem;
    overflow: auto;
  }
</style>

<PopupWrapper
  {close}
  label="Select image to add"
  closeButtonTitle="Close image select">
  <div class="dialog">
    <!-- Wrap in each to force a full re-render when folder changes -->
    {#each [folder] as item (item.path)}
      <FolderContent {item} {onItemSelect} />
    {/each}
  </div>
</PopupWrapper>
