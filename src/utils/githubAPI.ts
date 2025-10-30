export interface PRData {
  title: string;
  body: string | null;
  author: string;
  state: string;
  number: number;
  repository: string;
  merged: boolean;
  baseBranch: string;
  headBranch: string;
  createdAt: string;
  additions: number;
  deletions: number;
  changed_files: number;
}

export interface FileData {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
}

export async function fetchPRData(owner: string, repo: string, prNumber: string): Promise<PRData> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('PR not found. It may be private or the URL is incorrect.');
    } else if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again in a few minutes.');
    } else {
      throw new Error('Failed to fetch PR data');
    }
  }

  const data = await response.json();
  
  return {
    title: data.title,
    body: data.body,
    author: data.user.login,
    state: data.state,
    number: data.number,
    repository: `${owner}/${repo}`,
    merged: data.merged || false,
    baseBranch: data.base.ref,
    headBranch: data.head.ref,
    createdAt: data.created_at,
    additions: data.additions,
    deletions: data.deletions,
    changed_files: data.changed_files,
  };
}

export async function fetchPRFiles(owner: string, repo: string, prNumber: string): Promise<FileData[]> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`
  );

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again in a few minutes.');
    } else {
      throw new Error('Failed to fetch PR files');
    }
  }

  return response.json();
}
