import { request } from '@octokit/request';
import { headBranch, prodBranch, FileContent } from './data';
import type { File, CommitStatus, FolderContent } from './data';

export function initApiClient(accessKey: string) {
  const reqOptions = {
    baseUrl: process.env.GITHUB_API_URL || 'https://api.github.com',
    project: process.env.GITHUB_PROJECT,
    headers: {
      authorization: `token ${accessKey}`,
    },
  };
  const reqOptionsWithBranch = { ...reqOptions, ref: headBranch };

  function apiFilePath(from: string) {
    const isImage = from.startsWith('images');
    return isImage ? `site/static/${from}` : `site/${from}`;
  }

  function ownFilePath(from: string) {
    if (from.startsWith('site/static/')) {
      return from.replace('site/static/', '');
    }
    return from.replace('site/', '');
  }

  function validateFolderData(data: any): FolderContent {
    if (!Array.isArray(data)) {
      throw new Error('Unexpected response format.');
    }
    const validatedData = data.reduce<FolderContent>((list, d) => {
      if (typeof d === 'object') {
        const { name, path, type } = d;
        if (
          name &&
          typeof name === 'string' &&
          path &&
          typeof path === 'string' &&
          (type === 'file' || type === 'dir')
        ) {
          list.push({
            name,
            path: ownFilePath(path),
            type,
          });
        }
      }
      return list;
    }, []);
    return validatedData.sort((a, b) => (a.type >= b.type ? 1 : -1));
  }

  async function fetchFolder(path: string) {
    return request('GET /repos/:project/contents/:path', {
      ...reqOptionsWithBranch,
      path: apiFilePath(path),
    }).then(({ data }) => validateFolderData(data));
  }

  function validateFileContent(data: any): FileContent {
    if (typeof data !== 'object') {
      throw new Error('Unexpected response format.');
    }
    const { sha, content, encoding } = data;
    if (
      !sha ||
      typeof sha !== 'string' ||
      !content ||
      typeof content !== 'string' ||
      encoding !== 'base64'
    ) {
      throw new Error('Unexpected response data.');
    }
    return { sha, content };
  }

  async function fetchFileContent(path: string) {
    return request('GET /repos/:project/contents/:path', {
      ...reqOptionsWithBranch,
      path: apiFilePath(path),
    }).then(({ data }) => validateFileContent(data));
  }

  async function postNewFile(path: string, content: string): Promise<File> {
    return request('PUT /repos/:project/contents/:path', {
      ...reqOptions,
      path: apiFilePath(path),
      content,
      branch: headBranch,
      message: `Created ${path} via admin UI.`,
    }).then(({ data }) => ({
      type: 'file',
      name:
        (!!data &&
          !!data.content &&
          typeof data.content.name === 'string' &&
          data.content.name) ||
        path.split('/').slice(-1)[0] ||
        '',
      path:
        (!!data &&
          !!data.content &&
          typeof data.content.path === 'string' &&
          ownFilePath(data.content.path)) ||
        path,
    }));
  }

  async function postFileContents(path: string, sha: string, content: string) {
    return request('PUT /repos/:project/contents/:path', {
      ...reqOptions,
      path: apiFilePath(path),
      sha,
      content,
      branch: headBranch,
      message: `Changed ${path} via admin UI.`,
    }).then(({ data }) => ({
      sha:
        !!data && !!data.content && typeof data.content.sha === 'string'
          ? data.content.sha
          : '',
      content,
    }));
  }

  async function deleteFile(path: string, sha: string) {
    return request('DELETE /repos/:project/contents/:path', {
      ...reqOptionsWithBranch,
      path: apiFilePath(path),
      sha,
      branch: headBranch,
      message: `Deleted ${path} via admin UI.`,
    }).then(() => null);
  }

  function validateCommitStatus(data: any): CommitStatus {
    if (typeof data !== 'object') {
      throw new Error('Unexpected response format.');
    }
    const { status, ahead_by, behind_by, files, commits, base_commit } = data;
    if (!Array.isArray(files) || !Array.isArray(commits)) {
      throw new Error('Unexpected response data.');
    }
    const commitMessages = commits.map((c) =>
      !!c && !!c.commit && typeof c.commit.message === 'string'
        ? c.commit.message
        : ''
    );
    const otherFiles: string[] = [];
    const relevantFiles = files.reduce((list, f) => {
      if (
        typeof f === 'object' &&
        !!f.filename &&
        typeof f.filename === 'string'
      ) {
        if (f.filename.startsWith('site/content/')) {
          list.push(f.filename.replace('site/', ''));
        } else if (f.filename.startsWith('site/static/images/')) {
          list.push(f.filename.replace('site/static/', ''));
        } else {
          otherFiles.push(f.filename);
        }
      }
      return list;
    }, []);
    const latestCommit = commits.length
      ? commits[commits.length - 1]
      : base_commit;
    return {
      status: !!status && typeof status === 'string' ? status : '',
      aheadBy: typeof ahead_by === 'number' ? ahead_by : 0,
      behindBy: typeof behind_by === 'number' ? behind_by : 0,
      commits: commitMessages,
      fileCount: files.length,
      contentFiles: relevantFiles,
      otherFiles: otherFiles,
      baseCommitSha:
        !!base_commit && typeof base_commit.sha === 'string'
          ? base_commit.sha
          : '',
      latestCommitSha:
        !!latestCommit && typeof latestCommit.sha === 'string'
          ? latestCommit.sha
          : '',
    };
  }

  async function fetchCommitStatus() {
    return request('GET /repos/:project/compare/{base}...{head}', {
      ...reqOptions,
      base: prodBranch,
      head: headBranch,
    }).then(({ data }) => validateCommitStatus(data));
  }

  async function postUpdateBranch(branch: string, sha: string, force = false) {
    return request('PATCH /repos/:project/git/refs/:ref', {
      ...reqOptions,
      ref: `heads/${branch}`,
      sha,
      force,
    }).then(() => null); // No returned data used
  }

  async function fetchArchetype(name: string) {
    return request('GET /repos/:project/contents/:path', {
      ...reqOptionsWithBranch,
      path: `site/themes/${process.env.HUGO_THEME_NAME}/archetypes/${name}.md`,
    }).then(({ data }) => validateFileContent(data));
  }

  return {
    fetchFolder,
    fetchFileContent,
    postFileContents,
    postNewFile,
    deleteFile,
    fetchCommitStatus,
    postUpdateBranch,
    fetchArchetype,
  };
}

export type ApiClient = ReturnType<typeof initApiClient>;
