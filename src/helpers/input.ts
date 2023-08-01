import {getInput} from '@actions/core';

export type InputType = {
  webhooks: string[];
  base?: string;
  head?: string;
  data?: Record<string, unknown>;
};

export function getInputs(): InputType {
  const webhooks = getInput('webhooks')
    .split('\n')
    .map((str) => str.trim())
    .filter(Boolean);

  if (!webhooks.length) {
    throw new Error('webhook is not specified.');
  }

  const result: InputType = {webhooks};

  const base = getInput('base');
  if (base) {
    if (typeof base !== 'string') {
      throw new Error('base is not a string.');
    }
    result.base = base;
  }

  const head = getInput('head');
  if (head) {
    if (typeof head !== 'string') {
      throw new Error('head is not a string.');
    }
    result.head = head;
  }

  const data = getInput('data');
  if (data) {
    if (typeof data !== 'string') {
      throw new Error('data is not a string.');
    }
    const json = JSON.parse(data);
    if (typeof json !== 'object' || json === null || Array.isArray(json)) {
      throw new Error('data should be stringified JSON object.');
    }
    result.data = json;
  }

  return result;
}
