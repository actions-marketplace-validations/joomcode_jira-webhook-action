import {context} from '@actions/github';
import {setFailed} from '@actions/core';
import fetch from 'node-fetch';
import {
  getCommit,
  getCommitsBetween,
  getIssueIdsByCommits,
  getPullRequestIssueIds,
} from './helpers/github';
import {getInputs} from './helpers/input';

const getIssueIds = async () => {
  const {base, head} = getInputs();
  if (base && head) {
    const commits = await getCommitsBetween(base, head);
    const {ids} = getIssueIdsByCommits(commits);
    return [...ids];
  }

  const pr = context.payload.pull_request;
  if (pr) {
    return getPullRequestIssueIds(pr);
  }

  const commit = await getCommit(context.sha);
  const {ids} = getIssueIdsByCommits([commit]);
  return [...ids];
};

export const run = async () => {
  const {webhooks, data = {}} = getInputs();

  const issues = await getIssueIds();
  if (!issues.length) {
    console.log(`Can not find Jira IDs`);
    return;
  }

  const payload = {
    method: 'POST',
    body: JSON.stringify({
      issues,
      data,
    }),
  };

  return Promise.all(webhooks.map((webhook) => fetch(webhook, payload)));
};

run().catch((error) => {
  console.error('ERROR', error);
  setFailed(error.message);
});
