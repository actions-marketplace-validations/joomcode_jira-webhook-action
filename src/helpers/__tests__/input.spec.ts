import {getInputs, InputType} from '../input'; // Replace 'yourModule' with the actual path to your module
import * as core from '@actions/core';

// Mock the '@actions/core' module
jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
}));

describe('getInputs function', () => {
  const mockGetInput = core.getInput as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if webhooks input is not specified', () => {
    mockGetInput.mockReturnValueOnce('');

    expect(getInputs).toThrowError('webhook is not specified.');
  });

  it('should return inputs with only webhooks', () => {
    mockGetInput.mockReturnValueOnce('webhook1\nwebhook2');

    const expected: InputType = {
      webhooks: ['webhook1', 'webhook2'],
    };

    expect(getInputs()).toEqual(expected);
  });

  it('should include base input if provided', () => {
    mockGetInput.mockReturnValueOnce('webhook1');
    mockGetInput.mockReturnValueOnce('base-branch');

    const expected: InputType = {
      webhooks: ['webhook1'],
      base: 'base-branch',
    };

    expect(getInputs()).toEqual(expected);
  });

  it('should include head input if provided', () => {
    mockGetInput.mockReturnValueOnce('webhook1');
    mockGetInput.mockReturnValueOnce('');
    mockGetInput.mockReturnValueOnce('head-branch');

    const expected: InputType = {
      webhooks: ['webhook1'],
      head: 'head-branch',
    };

    expect(getInputs()).toEqual(expected);
  });

  it('should include data input if provided', () => {
    mockGetInput.mockReturnValueOnce('webhook1');
    mockGetInput.mockReturnValueOnce('');
    mockGetInput.mockReturnValueOnce('');
    mockGetInput.mockReturnValueOnce('{"key": "value"}');

    const expected: InputType = {
      webhooks: ['webhook1'],
      data: {key: 'value'},
    };

    expect(getInputs()).toEqual(expected);
  });

  it('should throw an error if data input is not a valid JSON', () => {
    mockGetInput.mockReturnValueOnce('webhook1');
    mockGetInput.mockReturnValueOnce('');
    mockGetInput.mockReturnValueOnce('');
    mockGetInput.mockReturnValueOnce('invalid-json');

    expect(getInputs).toThrowError();
  });

  it('should throw an error if data input is not a valid JSON object', () => {
    mockGetInput.mockReturnValueOnce('webhook1');
    mockGetInput.mockReturnValueOnce('');
    mockGetInput.mockReturnValueOnce('');
    mockGetInput.mockReturnValueOnce('[1, 2]');

    expect(getInputs).toThrowError();
  });
});
