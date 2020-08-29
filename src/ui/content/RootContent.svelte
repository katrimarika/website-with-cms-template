<script lang="ts">
  import { onMount } from 'svelte';
  import { getContentContext } from '../../utils/content';
  import { headBranch, prodBranch } from '../../utils/data';
  import { fetchErrorMessage } from '../../utils/helpers';
  import { goToPage } from '../../utils/route';
  import Button from '../components/Button.svelte';
  import LoadingWrapper from '../components/LoadingWrapper.svelte';
  import TitleWithButton from '../components/TitleWithButton.svelte';
  import Status from './Status.svelte';

  const { commitStatus } = getContentContext();

  $: statusData = $commitStatus;

  onMount(() => {
    commitStatus.fetchData();
  });

  function createFile() {
    goToPage({ page: 'new-file' });
  }
</script>

<style>
  p {
    margin: 0 0 1rem;
    font-weight: 500;
  }
</style>

<TitleWithButton title="Admin">
  <Button icon="create" styleType="light" onClick={createFile}>Compose</Button>
</TitleWithButton>
<p>{`"${headBranch}" vs "${prodBranch}"`}</p>
{#if statusData.status === 'loading'}
  <LoadingWrapper loading={true} />
{:else if statusData.status === 'success'}
  <Status status={statusData.data} />
{:else if statusData.status === 'error'}
  <div>{fetchErrorMessage('Failed to fetch status.', statusData.error)}</div>
{/if}
