import { writable } from 'svelte/store';

export const notAsked = { status: 'notasked' as const };

export type RemoteData<T> =
  | typeof notAsked
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: { message: string; status?: number } };

export type File = {
  name: string;
  path: string;
  type: 'file';
};

export type FileContent = {
  sha: string;
  content: string; // base64 encoded string
};

export type Folder = {
  name: string;
  path: string;
  type: 'dir';
};

export type FolderContent = Array<File | Folder>;

export type CommitStatus = {
  status: string;
  aheadBy: number;
  behindBy: number;
  commits: string[];
  fileCount: number;
  contentFiles: string[];
  otherFiles: string[];
  baseCommitSha: string;
  latestCommitSha: string;
};

export const headBranch = process.env.GITHUB_HEAD_BRANCH || 'master';
export const prodBranch = process.env.GITHUB_PROD_BRANCH || 'production';
export const filenameLimit = 45;

export const submitAlert = writable('');

type ConfirmProps = {
  message: string;
  onConfirm: () => void;
};
export const confirmAlert = writable<ConfirmProps | null>(null);
