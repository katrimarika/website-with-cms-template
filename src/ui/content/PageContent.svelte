<script lang="ts">
  import type { PageProps } from '../../utils/route';
  import Account from '../content/Account.svelte';
  import FileCreator from './FileCreator.svelte';
  import FolderCreator from './FolderCreator.svelte';

  export let props: PageProps;
</script>

<style>

</style>

{#if props.page === 'account'}
  <Account />
{:else if props.page === 'new-file'}
  <FileCreator parentPath={props.parent} />
{:else if props.page === 'new-folder'}
  <FolderCreator />
{/if}
