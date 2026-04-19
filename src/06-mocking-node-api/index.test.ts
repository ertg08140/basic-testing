// Uncomment the code below and write your tests
import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from '.';
import { join } from 'path';
import * as fs from 'fs';
import { readFile } from 'fs/promises';

jest.mock('path', () => {
  const actualPath = jest.requireActual('path');
  return {
    __esModule: true,
    ...actualPath,
    join: jest.fn((...args) => {
      return actualPath.join(...args);
    }),
  };
});

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

const delay = 500;

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();

    doStuffByTimeout(callback, delay);
    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, delay);
    setTimeoutSpy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();

    doStuffByTimeout(callback, delay);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(delay);

    expect(callback).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();

    doStuffByInterval(callback, delay);
    expect(setIntervalSpy).toHaveBeenCalledWith(callback, delay);
    setIntervalSpy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();

    doStuffByInterval(callback, delay);

    jest.advanceTimersByTime(3 * delay);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should call join with pathToFile', async () => {
    await readFileAsynchronously('./index.ts');
    expect(join).toHaveBeenCalled();
  });

  test('should return null if file does not exist', async () => {
    const result = await readFileAsynchronously('./does_not_exist.ts');
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const mockContent = Buffer.from('string');
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(mockContent);

    const result = await readFileAsynchronously('./index.ts');

    const jResult = join('index.ts');
    console.log('jr', jResult);
    expect(result).toBe('string');
  });
});
