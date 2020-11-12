<script lang="ts">
  import Button from '../components/Button.svelte';
  import TextArea from '../components/TextArea.svelte';
  import PreviewContent from './PreviewContent.svelte';
  import ImageSelect from './ImageSelect.svelte';

  export let contents: string;

  let previewOpen = false;
  let imagesOpen = false;

  let selectionStart: number = null;
  let selectionEnd: number = null;

  function addImage(name: string, path: string) {
    const i1 = typeof selectionStart === 'number' ? selectionStart : undefined;
    const i2 =
      typeof selectionEnd === 'number' ? selectionEnd : contents.length;
    contents = `${contents.slice(0, i1)}![${name}](/${path})${contents.slice(
      i2
    )}`;
  }

  function onBlur(e: FocusEvent & { currentTarget: HTMLTextAreaElement }) {
    selectionStart = e.currentTarget.selectionStart;
    selectionEnd = e.currentTarget.selectionEnd;
  }
</script>

<style>
  .toolbar {
    position: absolute;
    right: 0;
    padding: 0.25rem 0;
    display: flex;
    align-items: center;
  }
</style>

<TextArea
  id="file-contents"
  label="Contents"
  bind:value={contents}
  {onBlur}
  placeholder={'Enter file contents here as markdown with hugo yaml config on top'}>
  <div class="toolbar">
    <Button
      icon="crosshair"
      styleType="light"
      onClick={() => (imagesOpen = true)}
      style="margin-right: 0.75rem">
      Add image
    </Button>
    <Button
      icon="laptop"
      styleType="light"
      onClick={() => (previewOpen = true)}>
      Preview
    </Button>
  </div>
</TextArea>

{#if imagesOpen}
  <ImageSelect onSelect={addImage} close={() => (imagesOpen = false)} />
{/if}
{#if previewOpen}
  <PreviewContent bind:content={contents} close={() => (previewOpen = false)} />
{/if}
