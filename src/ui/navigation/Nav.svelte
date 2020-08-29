<script lang="ts">
  import { onMount } from 'svelte';
  import { getContentContext } from '../../utils/content';
  import { notAsked } from '../../utils/data';
  import { goToPage, goToRoot, rootFolders } from '../../utils/route';
  import Button from '../components/Button.svelte';
  import FileNavItem from '../navigation/FileNavItem.svelte';

  let expanded: boolean = true;

  const { foldersContent } = getContentContext();

  function toggle() {
    expanded = !expanded;
  }
  function selectAccount() {
    goToPage({ page: 'account' });
  }

  onMount(() => {
    // Pre-fetch main content instead of only after opening those folders
    const mainContent = $foldersContent[rootFolders[0]] || notAsked;
    if (mainContent.status === 'notasked') {
      foldersContent.fetchData(rootFolders[0]);
    }
  });
</script>

<style>
  .content {
    display: none;
  }

  .expanded {
    display: block;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  .top-container {
    margin-bottom: 0.5rem;
    display: flex;
  }

  .button-container {
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    display: flex;
  }

  .toggle-container {
    display: flex;
  }

  @media (min-width: 768px) {
    .content {
      display: block;
    }

    .toggle-container {
      display: none;
    }
  }
</style>

<div class="content" class:expanded>
  <div class="top-container">
    <Button
      styleType="light"
      onClick={goToRoot}
      icon="version"
      grow={true}
      alignStart={true}>
      Root
    </Button>
  </div>
  <ul>
    {#each rootFolders as name (name)}
      <FileNavItem item={{ name, type: 'dir', path: name }} />
    {/each}
  </ul>
  <div class="button-container">
    <Button
      styleType="light"
      onClick={selectAccount}
      icon="user"
      grow={true}
      alignStart={true}>
      Account
    </Button>
  </div>
</div>
<div class="toggle-container">
  <Button
    styleType="light"
    icon={expanded ? 'chevron_up_double' : 'chevron_down_double'}
    onClick={toggle}
    grow={true}>
    {expanded ? 'hide menu' : 'show menu'}
  </Button>
</div>
