<script lang="ts">
  import { getContentContext } from '../../utils/content';
  import type { FileContent } from '../../utils/data';
  import { filenameLimit, notAsked, submitAlert } from '../../utils/data';
  import {
    createSlug,
    decodeFileContents,
    encodeFileContents,
    fetchErrorMessage,
    useHugoTemplate,
  } from '../../utils/helpers';
  import { goToItem, goToRoot } from '../../utils/route';
  import Breadcrumbs from '../components/Breadcrumbs.svelte';
  import Button from '../components/Button.svelte';
  import Input from '../components/Input.svelte';
  import LoadingWrapper from '../components/LoadingWrapper.svelte';
  import Select from '../components/Select.svelte';
  import Title from '../components/Title.svelte';
  import FileContentEditor from './FileContentEditor.svelte';

  export let parentPath: string = undefined;

  const { foldersContent, archetypes } = getContentContext();

  let phase = 1;
  let loading = false;

  // First phase, ask title and location for using content archetype
  let title = '';
  let location = parentPath || 'content';

  // Second phase, values needed for file create
  let filename = '';
  let contents = '';

  $: folders = $foldersContent['content'] || notAsked;
  $: locationOptions = [
    'content',
    ...(folders.status === 'success'
      ? folders.data.filter((d) => d.type === 'dir').map((d) => d.path)
      : []),
  ];

  function useArchetype(data: FileContent | null, error?: string) {
    const slug = createSlug(title);
    if (data) {
      const decodedContents = decodeFileContents(data.content, submitAlert.set);
      const parsedContents = useHugoTemplate(decodedContents, title, slug);
      contents = parsedContents;
    } else {
      submitAlert.set(error || 'Error in using archetype.');
      contents = '';
    }
    filename = slug;
    loading = false;
    phase = 2;
  }

  function useDefaultArchetype() {
    const defaultData = $archetypes['default'] || notAsked;
    if (defaultData.status === 'success') {
      useArchetype(defaultData.data);
    } else if (defaultData.status === 'error') {
      useArchetype(
        null,
        fetchErrorMessage(
          'Could not fetch default archetype.',
          defaultData.error
        )
      );
    } else {
      archetypes
        .fetchData('default')
        .then((data) => useArchetype(data))
        .catch((err) =>
          useArchetype(
            null,
            fetchErrorMessage('Could not fetch default archetype.', err)
          )
        );
    }
  }

  function proceed() {
    loading = true;
    const archetypeName =
      location === 'content' ? 'default' : location.split('/').slice(-1)[0];
    const archetypeData = $archetypes[archetypeName] || notAsked;
    if (archetypeData.status === 'success') {
      useArchetype(archetypeData.data);
    } else if (archetypeData.status === 'error') {
      if (archetypeName !== 'default' && archetypeData.error.status === 404) {
        useDefaultArchetype();
      } else {
        useArchetype(
          null,
          fetchErrorMessage(
            `Could not fetch ${archetypeName} archetype.`,
            archetypeData.error
          )
        );
      }
    } else {
      archetypes
        .fetchData(archetypeName)
        .then((data) => useArchetype(data))
        .catch((e) => {
          if (e.status === 404) {
            useDefaultArchetype();
          } else {
            useArchetype(
              null,
              fetchErrorMessage(
                `Could not fetch ${archetypeName} archetype.`,
                e
              )
            );
          }
        });
    }
  }

  function onSubmit() {
    if (!!filename && filename.length <= filenameLimit) {
      loading = true;
      const encodedContents = encodeFileContents(contents, submitAlert.set);
      if (encodedContents === undefined) {
        loading = false;
        return;
      }
      foldersContent
        .createFile(`${location}/${filename}.md`, encodedContents)
        .then((f) => {
          submitAlert.set('File created successfully!');
          // Refetch parent folder content to show the new file
          foldersContent.fetchData(location, true);
          // Select the created file
          goToItem({ name: f.name, path: f.path, type: 'file' });
          loading = false;
        })
        .catch((e) => {
          submitAlert.set(fetchErrorMessage('Failed to create file.', e));
          loading = false;
        });
    } else {
      submitAlert.set(
        `Please enter a filename${
          !!filename ? `of max ${filenameLimit} characters` : ''
        }.`
      );
    }
  }

  function cancel() {
    if (parentPath) {
      goToItem({
        name: parentPath.split('/').slice(-1)[0],
        path: parentPath,
        type: 'dir',
      });
    } else {
      goToRoot();
    }
  }
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

<Breadcrumbs path={`${location}/`} />
<Title>{`New content${phase === 1 ? '' : ` in ${location}/`}`}</Title>
{#if phase === 1}
  <form on:submit|preventDefault={proceed} novalidate>
    <LoadingWrapper {loading}>
      <Select
        id="file-location"
        label="Location"
        bind:value={location}
        required={true}
        options={locationOptions} />
      <Input id="title" label="Title" bind:value={title} required={true} />
      <div class="button-container align-label">
        <Button type="submit" disabled={loading} grow={true}>Continue</Button>
        <div class="cancel-container">
          <Button styleType="light" onClick={cancel}>Cancel</Button>
        </div>
      </div>
    </LoadingWrapper>
  </form>
{:else}
  <form on:submit|preventDefault={onSubmit} novalidate>
    <LoadingWrapper {loading} grow={true}>
      <Input
        id="filename"
        label="Filename"
        suffix=".md"
        bind:value={filename}
        required={true}
        inputModifier={(s) => s.replace(/[^a-zA-Z0-9\-_]/g, '')} />
      <FileContentEditor bind:contents />
      <div class="button-container">
        <Button type="submit" disabled={loading} grow={true}>Save</Button>
        <div class="cancel-container">
          <Button styleType="light" onClick={() => (phase = 1)}>Back</Button>
        </div>
      </div>
    </LoadingWrapper>
  </form>
{/if}
