export interface ParsedPRUrl {
  owner: string;
  repo: string;
  prNumber: string;
}

export function parseGitHubPRUrl(url: string): ParsedPRUrl {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
  if (!match) {
    throw new Error('Invalid GitHub PR URL');
  }
  return {
    owner: match[1],
    repo: match[2],
    prNumber: match[3]
  };
}
