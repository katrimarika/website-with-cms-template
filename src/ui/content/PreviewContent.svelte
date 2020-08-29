<script lang="ts">
  import { afterUpdate } from 'svelte';
  import { getContentContext } from '../../utils/content';
  import { notAsked } from '../../utils/data';
  import { contentToHtml, getFileExtension } from '../../utils/helpers';
  import PopupWrapper from '../components/PopupWrapper.svelte';

  export let content: string;
  export let close: () => void;

  let previewContainer: HTMLElement;

  const { filesContent } = getContentContext();

  // Ensure images are the latest uploaded versions
  afterUpdate(() => {
    const images = previewContainer.querySelectorAll('img');
    images.forEach((i) => {
      if (
        !i.dataset.replaced &&
        !i.src.startsWith('data:') &&
        i.src.includes('/images/')
      ) {
        const path = i.src.slice(i.src.indexOf('/images/') + 1);
        const imgContentData = $filesContent[path] || notAsked;
        if (imgContentData.status === 'success') {
          i.src = `data:image/${getFileExtension(path) || 'png'};base64,${
            imgContentData.data.content
          }`;
        } else {
          filesContent
            .fetchData(path)
            .then((d) => {
              i.src = `data:image/${getFileExtension(path) || 'png'};base64,${
                d.content
              }`;
            })
            .catch(() => null);
        }
        i.setAttribute('data-replaced', 'true');
      }
    });
  });
</script>

<style>
  .dialog {
    min-height: 20rem;
    max-height: 95vh;
    width: 45rem;
    max-width: 95vw;
    background: var(--inverse-color);
    box-shadow: 1px 4px 8px rgba(0, 0, 0, 0.4);
    border-radius: 0.25rem;
    overflow: auto;
    padding: 1rem;
  }
</style>

<svelte:head>
  <style>
    #preview {
      line-height: 1.5;
    }

    #preview h1,
    #preview h2,
    #preview h3 {
      font-family: var(--title-font-family);
      font-style: normal;
      font-weight: 500;
      line-height: 1.3;
      margin: 0 0 1rem;
    }

    #preview h1 {
      font-size: 2rem;
    }

    #preview h2 {
      font-size: 1.5rem;
    }

    #preview h3 {
      font-size: 1.25rem;
    }

    #preview p {
      margin-top: 0;
      margin-bottom: 1rem;
    }

    #preview img:not(.icon) {
      max-width: 100%;
      margin: 1.5rem auto;
      display: block;
      box-shadow: 1px 4px 8px rgba(0, 0, 0, 0.4);
      border-radius: 0.25rem;
      overflow: hidden;
    }

    @media (min-width: 768px) {
      #preview img:not(.icon) {
        max-width: 80%;
        margin-top: 2rem;
        margin-bottom: 2rem;
      }
    }

    #preview a {
      color: var(--highlight-color);
      font-weight: 500;
      text-decoration: none;
    }

    #preview a:hover,
    #preview a:focus,
    #preview a:active {
      text-decoration: underline;
    }

    #preview strong {
      font-weight: 500;
    }

    #preview code {
      font-family: var(--code-font-family);
      font-weight: 400;
      background: var(--main-color);
      color: var(--inverse-color);
      padding: 0.0625rem 0.125rem;
    }

    #preview pre code {
      display: block;
      padding: 0.5rem 0.75rem 0.625rem;
      margin-bottom: 1rem;
    }
  </style>
</svelte:head>

<PopupWrapper
  {close}
  label="Content preview as HTML"
  closeButtonTitle="Close preview">
  <div class="dialog" id="preview" bind:this={previewContainer}>
    {@html contentToHtml(content)}
  </div>
</PopupWrapper>
