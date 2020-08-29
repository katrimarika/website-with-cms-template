<script lang="ts">
  import { getContentContext } from '../../utils/content';
  import type { File, FileContent } from '../../utils/data';
  import { submitAlert } from '../../utils/data';
  import {
    decodeFileContents,
    encodeFileContents,
    fetchErrorMessage,
  } from '../../utils/helpers';
  import Button from '../components/Button.svelte';
  import LoadingWrapper from '../components/LoadingWrapper.svelte';
  import FileContentEditor from './FileContentEditor.svelte';

  export let item: File;
  export let content: FileContent;
  export let deleteFile: () => void;

  const { filesContent } = getContentContext();

  let value = decodeFileContents(content.content, submitAlert.set);
  let loading = false;

  function onSubmit() {
    loading = true;
    const encodedContents = encodeFileContents(value, submitAlert.set);
    if (encodedContents === undefined) {
      loading = false;
      return;
    }
    filesContent
      .saveFile(item.path, content.sha, encodedContents)
      .then(() => {
        submitAlert.set('File updated successfully!');
        loading = false;
      })
      .catch((e) => {
        submitAlert.set(fetchErrorMessage('Failed to save changes.', e));
        loading = false;
      });
  }

  function reset() {
    value = decodeFileContents(content.content, submitAlert.set);
  }
</script>

<style>
  form {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .buttons-container {
    padding-top: 1rem;
  }

  .button-container {
    display: flex;
    align-items: center;
  }

  .cancel-container {
    margin: 0 0 0 1rem;
    padding: 0.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .delete-container {
    padding: 2.5rem 0 1rem;
    justify-content: center;
  }

  @media (min-width: 768px) {
    .buttons-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .button-container {
      flex: 1 1 auto;
    }

    .delete-container {
      padding: 0.5rem 0;
      justify-content: flex-end;
    }
  }
</style>

<form on:submit|preventDefault={onSubmit} novalidate>
  <LoadingWrapper {loading} grow={true}>
    <FileContentEditor bind:contents={value} />
    <div class="buttons-container">
      <div class="button-container">
        <Button type="submit" disabled={loading} grow={true}>Save</Button>
        <div class="cancel-container">
          <Button styleType="light" onClick={reset}>Reset</Button>
        </div>
      </div>
      <div class="button-container delete-container">
        <Button styleType="danger" onClick={deleteFile}>Delete</Button>
      </div>
    </div>
  </LoadingWrapper>
</form>
