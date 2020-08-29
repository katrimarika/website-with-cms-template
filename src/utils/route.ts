import { writable } from 'svelte/store';
import type { File, Folder } from './data';

export const rootFolders = ['content', 'images'];
type Item = { type: 'item'; item: File | Folder };
type Page = {
  type: 'page';
  props:
    | { page: 'account' }
    | { page: 'new-file' | 'new-folder'; parent?: string };
};
export type PageProps = Page['props'];

function isValidPath(path: string) {
  return (
    rootFolders.includes(path) ||
    path.startsWith('images/') ||
    path.startsWith('content/')
  );
}

const currentViewStore = writable<Item | Page | null>(null);

type StringDict = Record<string, string>;

function toQueryString(props: StringDict): string {
  return Object.keys(props)
    .sort()
    .map((k) => `${k}=${encodeURIComponent(props[k])}`)
    .join('&');
}

function fromQueryString(str: string): StringDict {
  const pairs = str.replace(/^[\?#]/, '').split('&');
  const result: StringDict = {};
  pairs.forEach((p) => {
    const i = p.indexOf('=');
    const key = p.slice(0, i === -1 ? p.length : i);
    const value = i === -1 ? null : p.slice(i + 1);
    if (!(key in result)) {
      // only add first value
      result[key] = decodeURIComponent(value);
    }
  });
  return result;
}

function pushHistory(props: StringDict) {
  const { origin, pathname } = window.location;
  const params = toQueryString(props);
  const newUrl = `${origin}${pathname}${params ? `?${params}` : ''}`;
  window.history.pushState({}, document.title, newUrl);
}

function historyListener() {
  const { file, dir, page, ...rest } = fromQueryString(window.location.search);
  if (page) {
    switch (page) {
      case 'account':
      case 'new-folder':
        return currentViewStore.set({ type: 'page', props: { page } });
      case 'new-file':
        const parent =
          rest.parent && isValidPath(rest.parent) ? rest.parent : undefined;
        return currentViewStore.set({
          type: 'page',
          props: { page, parent },
        });
    }
  } else if (file || dir) {
    const path = file || dir;
    if (isValidPath(path)) {
      const name = path.split('/').slice(-1).join('');
      return currentViewStore.set({
        type: 'item',
        item: { type: file ? 'file' : 'dir', name, path },
      });
    }
  } else {
    return currentViewStore.set(null);
  }
}

// On first load, parse state from history and add a listener for changes
historyListener();
window.addEventListener('popstate', historyListener);

// Export a read-only value
export const currentView = { subscribe: currentViewStore.subscribe };

// Export functions for "navigation"
export function goToRoot() {
  currentViewStore.set(null);
  pushHistory({});
}

export function goToItem(item: Item['item']) {
  currentViewStore.set({ type: 'item', item });
  pushHistory({ [item.type]: item.path });
}

export function goToPage(props: PageProps) {
  currentViewStore.set({ type: 'page', props });
  pushHistory(props);
}
