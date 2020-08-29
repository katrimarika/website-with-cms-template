<script lang="ts">
  import { afterUpdate, onDestroy } from 'svelte';
  import { getContentContext } from '../../utils/content';
  import { confirmAlert, notAsked, submitAlert } from '../../utils/data';
  import type { File } from '../../utils/data';
  import {
    capitalize,
    fetchErrorMessage,
    getFileExtension,
  } from '../../utils/helpers';
  import { goToItem } from '../../utils/route';
  import Breadcrumbs from '../components/Breadcrumbs.svelte';
  import Button from '../components/Button.svelte';
  import LoadingWrapper from '../components/LoadingWrapper.svelte';
  import Title from '../components/Title.svelte';
  import FileEditor from './FileEditor.svelte';

  export let item: File;

  let loading = false;
  let deleted = false;

  const { filesContent, foldersContent } = getContentContext();

  $: fileExtension = getFileExtension(item.name);
  $: fileType = ['png', 'jpeg'].includes(fileExtension) ? 'image' : 'file';
  $: fileContent = !item.name ? notAsked : $filesContent[item.path] || notAsked;

  afterUpdate(() => {
    if (!!item.name && fileContent.status === 'notasked') {
      filesContent.fetchData(item.path).catch(() => null);
    }
  });

  onDestroy(() => {
    if (deleted) {
      // Remove file content from store on destroy to prevent a refetch
      filesContent.removeData(item.path);
    }
  });

  function deleteFileFn(sha: string) {
    return () => {
      confirmAlert.set({
        message: `Are you sure you want to delete ${item.path}?`,
        onConfirm: () => {
          loading = true;
          filesContent
            .deleteFile(item.path, sha)
            .then(() => {
              deleted = true;
              const parentPath = item.path.split('/').slice(0, -1).join('/');
              const parentName = parentPath.split('/').slice(-1)[0];
              submitAlert.set('File deleted successfully!');
              // Refetch parent folder to update it's content
              foldersContent.fetchData(parentPath);
              // Go to the parent folder
              goToItem({ name: parentName, path: parentPath, type: 'dir' });
            })
            .catch((e) => {
              submitAlert.set(fetchErrorMessage('Failed to delete file.', e));
              loading = false;
            });
        },
      });
    };
  }
</script>

<style>
  img {
    max-width: 100%;
  }

  .button-container {
    margin-top: 1.5rem;
    padding: 0.5rem 0;
  }
</style>

<Breadcrumbs path={item.path} />
<Title>{`${capitalize(fileType)}: ${item.name}`}</Title>
<LoadingWrapper
  loading={loading || fileContent.status === 'loading'}
  grow={true}>
  {#if fileContent.status === 'success' && fileType === 'image'}
    <img
      src={`data:image/${fileExtension || 'png'};base64,${fileContent.data.content}`}
      alt={item.name} />
    <div class="button-container">
      <Button styleType="danger" onClick={deleteFileFn(fileContent.data.sha)}>
        Delete
      </Button>
    </div>
  {:else if fileContent.status === 'success'}
    <FileEditor
      {item}
      content={fileContent.data}
      deleteFile={deleteFileFn(fileContent.data.sha)} />
  {:else if fileContent.status === 'error'}
    <div>
      {fetchErrorMessage('Failed to fetch file content.', fileContent.error)}
    </div>
  {/if}
</LoadingWrapper>
