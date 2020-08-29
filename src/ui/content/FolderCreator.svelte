<script lang="ts">
  import { onMount } from 'svelte';
  import { getContentContext } from '../../utils/content';
  import { filenameLimit, notAsked, submitAlert } from '../../utils/data';
  import { goToItem } from '../../utils/route';
  import Breadcrumbs from '../components/Breadcrumbs.svelte';
  import Button from '../components/Button.svelte';
  import ImageUploader from '../components/ImageUploader.svelte';
  import Input from '../components/Input.svelte';
  import Title from '../components/Title.svelte';

  const { foldersContent } = getContentContext();

  let phase = 1;

  const path = 'images';
  let name = '';

  $: folders = $foldersContent[path] || notAsked;

  function proceed() {
    if (
      folders.status === 'success' &&
      folders.data.find((d) => d.name === name)
    ) {
      submitAlert.set('That name is already in use.');
    } else if (!!name && name.length <= filenameLimit) {
      phase = 2;
    } else {
      submitAlert.set(
        `Please enter a name${
          !!name ? `of max ${filenameLimit} characters` : ''
        }.`
      );
    }
  }

  function cancel() {
    goToItem({
      name: 'images',
      path: 'images',
      type: 'dir',
    });
  }

  function onSuccess() {
    goToItem({ name, path: `${path}/${name}`, type: 'dir' });
  }

  onMount(() => {
    if (folders.status === 'notasked') {
      foldersContent.fetchData(path);
    }
  });
</script>

<style>
  form {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .button-container {
    padding-top: 1rem;
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

  p {
    margin: 0 0 2rem;
  }

  @media (min-width: 768px) {
    .button-container {
      width: 50%;
    }

    .align-label {
      margin-left: 7rem;
      max-width: 20rem;
    }
  }
</style>

<Breadcrumbs path={`${path}/`} />
<Title>{`New image folder${phase === 1 ? '' : `: ${name}`}`}</Title>
{#if phase === 1}
  <form on:submit|preventDefault={proceed} novalidate>
    <Input
      id="folder-name"
      label="Name"
      bind:value={name}
      required={true}
      inputModifier={(s) => s.replace(/[^a-zA-Z0-9\-_]/g, '')} />
    <div class="button-container align-label">
      <Button type="submit" grow={true}>Continue</Button>
      <div class="cancel-container">
        <Button styleType="light" onClick={cancel}>Cancel</Button>
      </div>
    </div>
  </form>
{:else}
  <p>The folder is saved when a file is added.</p>
  <ImageUploader path={`${path}/${name}`} {onSuccess} />
{/if}
