<script lang="ts">
  import { authClient } from '../../utils/auth';
  import { setContentContext } from '../../utils/content';
  import { confirmAlert, submitAlert } from '../../utils/data';
  import { currentView } from '../../utils/route';
  import PopupAlert from '../components/PopupAlert.svelte';
  import PopupConfirm from '../components/PopupConfirm.svelte';
  import FileContent from '../content/FileContent.svelte';
  import FolderContent from '../content/FolderContent.svelte';
  import PageContent from '../content/PageContent.svelte';
  import RootContent from '../content/RootContent.svelte';
  import Nav from '../navigation/Nav.svelte';

  $: selected = $currentView;

  setContentContext(authClient.getAccessKey());
</script>

<style>
  main {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  nav {
    padding-bottom: 1rem;
    flex: 0 0 auto;
  }

  section {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
  }

  @media (min-width: 768px) {
    main {
      flex-direction: row;
      align-items: stretch;
    }

    nav {
      width: 15rem;
      max-width: 30%;
      padding-top: 0.375rem;
      padding-right: 1rem;
      margin-right: 1.5rem;
      border-right: 1px solid var(--border-color);
    }
  }
</style>

<main>
  <nav>
    <Nav />
  </nav>
  <section>
    {#if !!selected}
      {#if selected.type === 'item'}
        <!-- Wrap in each to force a full re-render when item changes -->
        {#each [selected.item] as item (item.path)}
          {#if item.type === 'dir'}
            <FolderContent {item} />
          {:else}
            <FileContent {item} />
          {/if}
        {/each}
      {:else}
        <PageContent props={selected.props} />
      {/if}
    {:else}
      <RootContent />
    {/if}
  </section>
</main>
{#if !!$submitAlert}
  <PopupAlert message={$submitAlert} close={() => submitAlert.set('')} />
{/if}
{#if !!$confirmAlert}
  <PopupConfirm {...$confirmAlert} close={() => confirmAlert.set(null)} />
{/if}
