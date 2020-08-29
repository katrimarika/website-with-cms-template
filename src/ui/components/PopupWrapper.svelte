<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import CloseButton from './CloseButton.svelte';

  export let close: () => void;
  export let closeButtonTitle: string = undefined;
  export let label: string = undefined;
  export let describedBy: string = undefined;

  let element: HTMLDivElement;
  let dialogElement: HTMLDialogElement;
  let previousFocus: HTMLElement;

  function onOverlayClick(event: MouseEvent) {
    if (event.target === element || event.target === dialogElement) {
      close();
    }
  }

  function keyPressListener(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      close();
    } else if (event.key === 'Tab') {
      const focusables = [
        ...element.querySelectorAll(
          'a, button, input:not([tabindex="-1"]), [tabindex="0"]'
        ),
      ] as HTMLElement[];
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (event.shiftKey) {
        if (event.target === firstEl) {
          event.preventDefault();
          lastEl.focus();
        }
      } else if (event.target === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    }
  }

  onMount(() => {
    // Store focus information
    const activeEl = document.activeElement as HTMLElement;
    previousFocus = activeEl && 'focus' in activeEl ? activeEl : document.body;
    // Create a portal to position the popup always after all content
    const portal = document.createElement('div');
    document.body.appendChild(portal);
    portal.appendChild(element);
    // Focus on first element
    const focusables = [
      ...element.querySelectorAll('a, button, input, [tabindex]'),
    ] as HTMLElement[];
    if (focusables.length) {
      focusables[0].focus();
    }

    // On unmount
    return () => {
      // Restore focus to earlier element
      previousFocus.focus();
      // Remove the portal
      document.body.removeChild(portal);
    };
  });
</script>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  dialog {
    position: relative;
    display: block;
    background: transparent;
    border: none;
    padding: 0;
  }
</style>

<svelte:window on:keydown={keyPressListener} />

<svelte:head>
  <style>
    body {
      overflow: hidden; /* prevent body scroll when a popup is open */
    }
  </style>
</svelte:head>

<div class="overlay" on:click={onOverlayClick} bind:this={element}>
  <dialog
    bind:this={dialogElement}
    aria-modal="true"
    aria-label={label}
    aria-describedby={describedBy}>
    <slot />
    {#if closeButtonTitle}
      <CloseButton title={closeButtonTitle} {close} />
    {/if}
  </dialog>
</div>
