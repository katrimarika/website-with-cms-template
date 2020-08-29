<script lang="ts">
  import { afterUpdate } from 'svelte';
  import { getContentContext } from '../../utils/content';
  import { notAsked } from '../../utils/data';
  import type { File } from '../../utils/data';
  import { fetchErrorMessage, getFileExtension } from '../../utils/helpers';
  import LoadingWrapper from '../components/LoadingWrapper.svelte';
  import PopupWrapper from '../components/PopupWrapper.svelte';

  export let currentImage: File;
  export let list: File[];
  export let setCurrent: (image: File | null) => void;
  export let onSelect: () => void = undefined;

  const { filesContent } = getContentContext();

  $: fileContent = $filesContent[currentImage.path] || notAsked;
  $: loading =
    fileContent.status === 'notasked' || fileContent.status === 'loading';
  $: currentIndex = list.findIndex((item) => item.path === currentImage.path);
  $: previous = list[currentIndex - 1];
  $: next = currentIndex === -1 ? undefined : list[currentIndex + 1];

  afterUpdate(() => {
    if (fileContent.status === 'notasked') {
      filesContent.fetchData(currentImage.path).catch(() => null);
    }
  });
</script>

<style>
  .loading {
    min-height: 20rem;
    min-width: 40rem;
  }

  .dialog {
    max-width: 95vw;
    max-height: calc(95vh - 2.5rem);
    display: flex;
    flex-direction: column;
    margin-bottom: 2.5rem;
  }

  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    background: var(--inverse-color);
    box-shadow: 1px 4px 8px rgba(0, 0, 0, 0.4);
    border-radius: 0.25rem;
    padding: 0.25rem;
  }

  img {
    width: 100%;
  }

  .buttons-container {
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
  }

  .select-container {
    right: unset;
    left: 0;
  }

  button {
    font-family: var(--font-family);
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.2;
    color: var(--main-color);
    background-color: white;
    background-repeat: no-repeat;
    background-size: 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
  }

  .next {
    background-position: right center;
    background-image: url('assets/chevron_right.svg');
    padding-right: 1.25rem;
  }

  .previous {
    background-position: left center;
    background-image: url('assets/chevron_left.svg');
    padding-left: 1.25rem;
    margin-right: 0.25rem;
  }

  button:disabled {
    color: var(--border-color);
    border-color: var(--border-color);
    cursor: initial;
  }

  button:not(:disabled):hover,
  button:not(:disabled):focus,
  button:not(:disabled):active {
    box-shadow: inset 0 0 0 1px var(--border-color),
      1px 2px 4px rgba(0, 0, 0, 0.2);
  }
</style>

<PopupWrapper
  close={() => setCurrent(null)}
  label="Image gallery"
  closeButtonTitle="Close image gallery">
  <!-- Wrap in each to force a full re-render when selected image changes -->
  {#each [currentImage] as img (img.path)}
    <div class="dialog" class:loading>
      <div class="content">
        {#if fileContent.status === 'success'}
          <img
            src={`data:image/${getFileExtension(img.name) || 'png'};base64,${fileContent.data.content}`}
            alt={img.name} />
        {:else if fileContent.status === 'error'}
          <div>
            {fetchErrorMessage('Failed to fetch file content.', fileContent.error)}
          </div>
        {:else}
          <LoadingWrapper loading={true} grow={true} />
        {/if}
      </div>
    </div>
  {/each}
  {#if onSelect}
    <div type="button" class="buttons-container select-container">
      <button on:click={onSelect}>Select</button>
    </div>
  {/if}
  <div class="buttons-container">
    <button
      type="button"
      class="previous"
      on:click={() => setCurrent(previous)}
      disabled={!previous}>
      Previous
    </button>
    <button
      type="button"
      class="next"
      on:click={() => setCurrent(next)}
      disabled={!next}>
      Next
    </button>
  </div>
</PopupWrapper>
