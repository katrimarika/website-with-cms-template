<script lang="ts">
  import { getContentContext } from '../../utils/content';
  import { submitAlert } from '../../utils/data';
  import { fetchErrorMessage, fileToBase64 } from '../../utils/helpers';
  import Button from '../components/Button.svelte';
  import LoadingWrapper from './LoadingWrapper.svelte';

  export let path: string;
  export let onSuccess: () => void = undefined;

  let inputElement: HTMLInputElement;
  let loading = false;

  const { foldersContent } = getContentContext();

  function clickInput() {
    if (inputElement) {
      inputElement.click();
    }
  }

  function fileChanged(e: Event & { currentTarget: HTMLInputElement }) {
    const files = e.currentTarget.files;
    if (files.length) {
      const file = files[0];
      if (
        ['image/png', 'image/jpeg'].includes(file.type) &&
        !!file.name &&
        file.size <= 1000000
      ) {
        loading = true;
        fileToBase64(file)
          .then((str) => {
            const contents = str.replace(`data:${file.type};base64,`, '');
            foldersContent
              .createFile(`${path}/${file.name}`, contents)
              .then(() => {
                submitAlert.set('Image uploaded successfully!');
                // Refetch parent folder content to show the new file
                foldersContent.fetchData(path, true);
                loading = false;
                if (onSuccess) onSuccess();
              })
              .catch((e) => {
                submitAlert.set(
                  fetchErrorMessage('Failed to upload image.', e)
                );
                e.currentTarget.value = '';
                loading = false;
              });
          })
          .catch((e) => {
            submitAlert.set(e);
            e.currentTarget.value = '';
            loading = false;
          });
      } else {
        submitAlert.set(
          `Invalid file: ${file.name} (${file.type}, ${file.size} B).`
        );
        e.currentTarget.value = '';
      }
    }
  }
</script>

<style>
  div {
    display: flex;
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  p {
    margin: 0.5rem 0 0;
  }
</style>

<div>
  <LoadingWrapper {loading} small={true}>
    <Button icon="upload-inverse" onClick={clickInput}>Upload image</Button>
    <input
      type="file"
      accept="image/png, image/jpeg"
      tabindex={-1}
      aria-hidden="true"
      bind:this={inputElement}
      on:change={fileChanged} />
  </LoadingWrapper>
</div>

<p>
  <small>
    Supported filetypes are png and jpeg, maximum filesize 1 MB. The image is
    immediately uploaded with the name of the selected file.
  </small>
</p>
