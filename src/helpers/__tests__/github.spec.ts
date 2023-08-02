import {getIssueIdsByCommits, getCommit, getPullRequestIssueIds} from '../github'; // Replace 'yourModule' with the actual path to your module

// Mock the '@actions/core' and '@actions/github' modules
jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
}));

jest.mock('@actions/github', () => ({
  context: {
    repo: {
      owner: 'owner',
      repo: 'repo',
    },
    payload: {
      pull_request: {
        number: 123,
        title: 'PR Title',
      },
    },
  },
  getOctokit: jest.fn(),
}));

// Mock getOctokit and rest methods
const mockGetOctokit = require('@actions/github').getOctokit as jest.Mock;
const mockRest = {
  repos: {
    listCommits: jest.fn(),
    getCommit: jest.fn(),
    compareCommits: jest.fn(),
  },
  pulls: {
    listCommits: jest.fn(),
  },
};
const mockPaginate = jest.fn();
mockGetOctokit.mockReturnValue({
  rest: mockRest,
  paginate: mockPaginate,
});

describe('GitHub functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getIssueIdsByCommits should extract issue ids', () => {
    const commits = [
      {sha: 'sha1', commit: {message: 'Fixing ABC-123'}},
      {sha: 'sha2', commit: {message: 'Resolving DEF-456'}},
    ];
    const result = getIssueIdsByCommits(commits);

    expect(result.ids).toEqual(new Set(['ABC-123', 'DEF-456']));
    expect(result.bySha.get('sha1')).toEqual(['ABC-123']);
    expect(result.bySha.get('sha2')).toEqual(['DEF-456']);
  });

  it('getCommit should retrieve a commit', async () => {
    const commitData = {sha: 'commit_sha', data: 'commit_data'};
    mockRest.repos.getCommit.mockResolvedValueOnce({data: commitData});

    const result = await getCommit('commit_sha');

    expect(result).toEqual(commitData);
    expect(mockRest.repos.getCommit).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      ref: 'commit_sha',
    });
  });

  it('getPullRequestIssueIds should retrieve issue ids from PR and commits', async () => {
    const mockCommits = [
      {sha: 'sha1', commit: {message: 'Fixing ABC-123'}},
      {sha: 'sha2', commit: {message: 'Resolving DEF-456'}},
    ];
    mockPaginate.mockResolvedValueOnce(mockCommits);
    const result = await getPullRequestIssueIds({
      number: 123,
      title: 'PR Title',
    });

    expect(result).toEqual(['ABC-123', 'DEF-456']);
  });
});
