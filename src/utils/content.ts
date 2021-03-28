import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import {
  CommitStatus,
  FileContent,
  FolderContent,
  headBranch,
  notAsked,
  prodBranch,
  RemoteData,
} from './data';
import { initApiClient } from './fetch';
import type { ApiClient } from './fetch';

function initFoldersContent(apiClient: ApiClient) {
  let fetching = {};
  const { subscribe, update } = writable<{
    [key: string]: RemoteData<FolderContent>;
  }>({});

  function fetchData(path: string, silent = false) {
    if (!silent) {
      update((oldData) => ({ ...oldData, [path]: { status: 'loading' } }));
    }
    if (path in fetching) {
      // Prevent doing simultaneuous requests for same data
    } else {
      fetching[path] = apiClient
        .fetchFolder(path)
        .then((data) =>
          update((oldData) => ({
            ...oldData,
            [path]: { status: 'success', data },
          }))
        )
        .catch((e) =>
          update((oldData) => ({
            ...oldData,
            [path]: {
              status: 'error',
              error: e,
            },
          }))
        )
        .finally(() => {
          delete fetching[path];
        });
    }
  }

  async function createFile(path: string, content: string) {
    return apiClient.postNewFile(path, content);
  }

  return {
    subscribe,
    fetchData,
    createFile,
  };
}

function initFilesContent(apiClient: ApiClient) {
  let fetching = {};
  const { subscribe, update } = writable<{
    [key: string]: RemoteData<FileContent>;
  }>({});

  async function fetchData(path: string) {
    update((oldData) => ({ ...oldData, [path]: { status: 'loading' } }));
    if (path in fetching) {
      // Prevent doing simultaneuous requests for same data
      return fetching[path];
    } else {
      const promise = apiClient
        .fetchFileContent(path)
        .then((data) => {
          update((oldData) => ({
            ...oldData,
            [path]: { status: 'success', data },
          }));
          return data;
        })
        .catch((e) => {
          update((oldData) => ({
            ...oldData,
            [path]: {
              status: 'error',
              error: e,
            },
          }));
          throw e;
        })
        .finally(() => {
          delete fetching[path];
        });
      fetching[path] = promise;
      return promise;
    }
  }

  function removeData(path: string) {
    update((oldData) => ({ ...oldData, [path]: { status: 'notasked' } }));
  }

  async function saveFile(path: string, sha: string, content: string) {
    return apiClient.postFileContents(path, sha, content).then((data) =>
      update((oldData) => ({
        ...oldData,
        [path]: { status: 'success', data },
      }))
    );
  }

  async function deleteFile(path: string, sha: string) {
    return apiClient.deleteFile(path, sha);
  }

  return {
    subscribe,
    fetchData,
    removeData,
    saveFile,
    deleteFile,
  };
}

function initCommitStatus(apiClient: ApiClient) {
  const { subscribe, set } = writable<RemoteData<CommitStatus>>(notAsked);

  function fetchData() {
    set({ status: 'loading' });
    apiClient
      .fetchCommitStatus()
      .then((data) => set({ status: 'success', data }))
      .catch((e) =>
        set({
          status: 'error',
          error: e,
        })
      );
  }

  async function publish(sha: string, withForce?: boolean) {
    return apiClient.postUpdateBranch(prodBranch, sha, withForce).then(() => {
      fetchData(); // refetch commit status
    });
  }

  async function revert(sha: string) {
    return apiClient.postUpdateBranch(headBranch, sha, true).then(() => {
      fetchData(); // refetch commit status
    });
  }

  return {
    subscribe,
    fetchData,
    publish,
    revert,
  };
}

function initArchetypes(apiClient: ApiClient) {
  let fetching = {};
  const { subscribe, update } = writable<{
    [key: string]: RemoteData<FileContent>;
  }>({});

  // Return the fetched data, but also store it
  async function fetchData(name: string): Promise<FileContent> {
    update((oldData) => ({ ...oldData, [name]: { status: 'loading' } }));
    if (name in fetching) {
      // Prevent doing simultaneuous requests for same data
      return fetching[name];
    } else {
      const promise = apiClient
        .fetchArchetype(name)
        .then((data) => {
          update((oldData) => ({
            ...oldData,
            [name]: { status: 'success', data },
          }));
          return data;
        })
        .catch((e) => {
          update((oldData) => ({
            ...oldData,
            [name]: {
              status: 'error',
              error: e,
            },
          }));
          throw e;
        })
        .finally(() => {
          delete fetching[name];
        });
      fetching[name] = promise;
      return promise;
    }
  }

  return {
    subscribe,
    fetchData,
  };
}

const contentContextKey = { name: 'ContentContext' };
function initContentContext(accessKey: string) {
  const apiClient = initApiClient(accessKey);
  const foldersContent = initFoldersContent(apiClient);
  const filesContent = initFilesContent(apiClient);
  const commitStatus = initCommitStatus(apiClient);
  const archetypes = initArchetypes(apiClient);

  return { foldersContent, filesContent, commitStatus, archetypes };
}

export function setContentContext(accessKey: string) {
  return setContext(contentContextKey, initContentContext(accessKey));
}

export function getContentContext(): ReturnType<typeof initContentContext> {
  return getContext(contentContextKey);
}
