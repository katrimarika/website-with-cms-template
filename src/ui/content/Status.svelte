<script lang="ts">
  import { getContentContext } from '../../utils/content';
  import {
    confirmAlert,
    headBranch,
    prodBranch,
    submitAlert,
  } from '../../utils/data';
  import type { CommitStatus } from '../../utils/data';
  import { capitalize, fetchErrorMessage } from '../../utils/helpers';
  import Button from '../components/Button.svelte';
  import LoadingWrapper from '../components/LoadingWrapper.svelte';

  export let status: CommitStatus;

  const { commitStatus } = getContentContext();

  let loading = false;

  $: otherFilesCount = status.fileCount - status.contentFiles.length;

  function publishChanges() {
    const onConfirm = (withForce?: boolean) => {
      loading = true;
      commitStatus
        .publish(status.latestCommitSha, withForce)
        .then(() => {
          submitAlert.set(`Successfully published changes to ${prodBranch}.`);
          // Refetch status
          commitStatus.fetchData();
          loading = false;
        })
        .catch((e) => {
          submitAlert.set(fetchErrorMessage('Failed to publish changes.', e));
          loading = false;
        });
    };
    const notFastForward = status.behindBy > 0;
    if (notFastForward || otherFilesCount) {
      const notFastForwardMessage =
        'The publish may not succees as the target is behind. Are you sure you want to try to publish anyway?';
      const otherFilesMessage = `The changes include ${otherFilesCount} modified file(s) outside content and images folders.`;
      confirmAlert.set({
        message:
          otherFilesCount && notFastForward
            ? `${otherFilesMessage} ${notFastForwardMessage}`
            : notFastForward
            ? notFastForwardMessage
            : `${otherFilesMessage} Are you sure you want to publish the changes?`,
        onConfirm: () => onConfirm(notFastForward),
      });
    } else {
      onConfirm();
    }
  }

  function revertChanges() {
    confirmAlert.set({
      message: `Are you sure you want to revert changes in ${headBranch}?`,
      onConfirm: () => {
        loading = true;
        commitStatus
          .revert(status.baseCommitSha)
          .then(() => {
            submitAlert.set(`Successfully reverted changes in ${headBranch}.`);
            // Refetch status
            commitStatus.fetchData();
            loading = false;
          })
          .catch((e) => {
            submitAlert.set(fetchErrorMessage('Failed to revert changes.', e));
            loading = false;
          });
      },
    });
  }
</script>

<style>
  dl {
    margin: 0;
  }

  dt {
    margin-bottom: 0.5rem;
  }

  dd {
    margin: 0 0 1rem 2rem;
  }

  ul {
    margin: 0;
    padding-left: 1.125rem;
  }

  .buttons-container {
    margin-top: 2rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .publish-container {
    padding-bottom: 1rem;
    margin-right: 1.5rem;
  }

  .revert-container {
    padding: 0.5rem 0 1.5rem;
  }

  p {
    margin: 0 0 1rem;
  }
</style>

<LoadingWrapper {loading}>
  <dl>
    <dt>Status</dt>
    <dd>
      {`${capitalize(status.status)} (${status.aheadBy}/${status.behindBy})`}
    </dd>
    <dt>Commits</dt>
    <dd>
      {#if status.commits.length}
        <ul>
          {#each status.commits as c}
            <li>{c}</li>
          {/each}
        </ul>
      {:else}No commits{/if}
    </dd>
    <dt>Files changed</dt>
    <dd>
      {#if status.fileCount}
        <ul>
          {#each status.contentFiles as f}
            <li>{f}</li>
          {:else}
            <li>No changed content files</li>
          {/each}
          {#if otherFilesCount}
            <li>
              {`${otherFilesCount} file(s) outside content and images folders`}
            </li>
          {/if}
        </ul>
      {:else}No files changed{/if}
    </dd>
  </dl>
  <div class="buttons-container">
    {#if status.aheadBy}
      {#if status.latestCommitSha}
        <div class="publish-container">
          <Button
            icon="upload_alt-inverse"
            onClick={publishChanges}
            disabled={loading}>
            Publish changes
          </Button>
        </div>
      {/if}
      {#if status.baseCommitSha && !otherFilesCount}
        <div class="revert-container">
          <Button styleType="danger" onClick={revertChanges} disabled={loading}>
            Revert changes
          </Button>
        </div>
      {/if}
    {:else}
      <p>
        <small>No changes to publish.</small>
      </p>
    {/if}
  </div>
</LoadingWrapper>
