<script lang="ts">
  import { onMount } from 'svelte';
  import { getContentContext } from '../../utils/content';
  import { notAsked } from '../../utils/data';
  import type { File, Folder } from '../../utils/data';
  import { fetchErrorMessage } from '../../utils/helpers';
  import { currentView, goToItem } from '../../utils/route';
  import Button from '../components/Button.svelte';
  import LoadingWrapper from '../components/LoadingWrapper.svelte';

  export let item: File | Folder;

  const { foldersContent } = getContentContext();

  let expanded: boolean = false;
  $: currentSelected = $currentView;
  $: selected =
    currentSelected &&
    currentSelected.type === 'item' &&
    currentSelected.item.path === item.path;

  $: folderContent =
    item.type === 'dir' ? $foldersContent[item.path] || notAsked : null;

  function onClick() {
    goToItem(item);
    if (item.type === 'dir' && !expanded) {
      expanded = true;
    }
  }
  function toggle() {
    if (!expanded && folderContent && folderContent.status === 'notasked') {
      foldersContent.fetchData(item.path);
    }
    expanded = !expanded;
  }

  onMount(() => {
    const isParentOfSelected =
      currentSelected &&
      currentSelected.type === 'item' &&
      item.type === 'dir' &&
      currentSelected.item.path.startsWith(item.path);
    if (isParentOfSelected && !expanded) {
      expanded = true;
      if (folderContent && folderContent.status === 'notasked') {
        foldersContent.fetchData(item.path);
      }
    }
  });
</script>

<style>
  li {
    margin-bottom: 0.5rem;
    list-style-type: none;
  }

  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .loading {
    padding: 0.125rem 0;
  }

  .error {
    padding: 0.25rem 0;
    font-size: 0.875rem;
  }

  ul {
    margin: 0.5rem 0 0;
    padding: 0 0 0 0.75rem;
    border-left: 1px solid var(--border-color);
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .selected {
    border-bottom: 1px solid var(--main-color);
    margin-bottom: -1px;
  }
</style>

<li>
  <div>
    <Button
      styleType={item.type === 'file' ? 'extra-light' : 'light'}
      icon={item.type === 'file' ? 'document' : expanded ? 'folder_open' : 'folder_closed'}
      grow={true}
      alignStart={true}
      {onClick}>
      <span class:selected>{item.name}</span>
    </Button>
    {#if item.type === 'dir'}
      <Button
        styleType="light"
        icon={expanded ? 'chevron_down' : 'chevron_right'}
        title={expanded ? 'Minimise folder' : 'Expand folder'}
        onClick={toggle} />
    {/if}
  </div>
  {#if expanded && folderContent}
    <ul>
      {#if folderContent.status === 'loading'}
        <li class="loading">
          <LoadingWrapper loading={true} small={true} />
        </li>
      {:else if folderContent.status === 'success' && folderContent.data.length}
        {#each folderContent.data as child (child.path)}
          <svelte:self item={child} />
        {/each}
      {:else if folderContent.status === 'error'}
        <li class="error">
          {fetchErrorMessage('Failed to fetch content.', folderContent.error)}
        </li>
      {/if}
    </ul>
  {/if}
</li>
