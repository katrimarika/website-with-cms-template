<script lang="ts">
  import { onMount } from 'svelte';
  import { getContentContext } from '../../utils/content';
  import { notAsked } from '../../utils/data';
  import type { File, Folder } from '../../utils/data';
  import { capitalize, fetchErrorMessage } from '../../utils/helpers';
  import { goToItem, goToPage, rootFolders } from '../../utils/route';
  import Breadcrumbs from '../components/Breadcrumbs.svelte';
  import Button from '../components/Button.svelte';
  import ImageUploader from '../components/ImageUploader.svelte';
  import LoadingWrapper from '../components/LoadingWrapper.svelte';
  import TitleWithButton from '../components/TitleWithButton.svelte';
  import FolderContentList from './FolderContentList.svelte';
  import ImageGallery from './ImageGallery.svelte';

  export let item: Folder;
  export let onItemSelect: (f: File | Folder) => void = undefined;

  const { foldersContent } = getContentContext();

  let selectedImage: File | null = null;

  $: folderContent = $foldersContent[item.path] || notAsked;
  $: isImages = item.path.startsWith('images');
  $: isImageRoot = item.path === 'images';
  $: imageFiles =
    isImages && folderContent.status === 'success'
      ? (folderContent.data.filter((d) => d.type === 'file') as File[])
      : [];
  $: isTopLevel = rootFolders.includes(item.path);

  onMount(() => {
    if (folderContent.status === 'notasked') {
      foldersContent.fetchData(item.path);
    }
  });

  function onItemClick(f: Folder | File) {
    if (onItemSelect) {
      onItemSelect(f);
    } else {
      goToItem(f);
    }
  }

  function onImgSelect(f: File, select: typeof onItemSelect) {
    return () => {
      selectedImage = null;
      select(f);
    };
  }

  function createFile() {
    goToPage({ page: 'new-file', parent: item.path });
  }

  function createFolder() {
    goToPage({ page: 'new-folder', parent: item.path });
  }
</script>

<style>
  .button-container {
    margin-top: 1rem;
  }
</style>

<Breadcrumbs path={item.path} {onItemSelect} />
<TitleWithButton
  title={isTopLevel ? capitalize(item.name) : `${isImages ? 'Images' : 'Section'}: ${item.name}`}
  hideButton={isImages && !isImageRoot}>
  {#if isImageRoot}
    <Button icon="folder_add" styleType="light" onClick={createFolder}>
      New folder
    </Button>
  {:else if !isImages}
    <Button icon="create" styleType="light" onClick={createFile}>
      Compose
    </Button>
  {/if}
</TitleWithButton>
{#if folderContent.status === 'loading'}
  <LoadingWrapper loading={true} />
{:else if folderContent.status === 'success'}
  <FolderContentList
    content={folderContent.data}
    {onItemClick}
    onPreview={(f) => (selectedImage = f)} />
  {#if isImages}
    <div class="button-container">
      <ImageUploader path={item.path} />
    </div>
  {/if}
{:else if folderContent.status === 'error'}
  <div>
    {fetchErrorMessage('Failed to fetch folder content.', folderContent.error)}
  </div>
{/if}

{#if selectedImage && imageFiles.length}
  <ImageGallery
    currentImage={selectedImage}
    list={imageFiles}
    setCurrent={(i) => (selectedImage = i)}
    onSelect={onItemSelect ? onImgSelect(selectedImage, onItemSelect) : undefined} />
{/if}
