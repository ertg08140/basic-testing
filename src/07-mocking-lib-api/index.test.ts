// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('lodash', () => ({
  throttle: (fn: (...args: unknown[]) => unknown) => fn,
}));

jest.mock('axios');

const mockedAxios = jest.mocked(axios);

describe('throttledGetDataFromApi', () => {
  const mockGet = jest.fn();

  beforeEach(() => {
    mockGet.mockResolvedValue({ data: { id: 1, title: 'test' } });
    mockedAxios.create.mockReturnValue({
      get: mockGet,
    } as unknown as ReturnType<typeof axios.create>);
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('/posts/1');

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi('/users/2');

    expect(mockGet).toHaveBeenCalledWith('/users/2');
  });

  test('should return response data', async () => {
    const payload = { userId: 1, id: 42, title: 'foo', body: 'bar' };
    mockGet.mockResolvedValueOnce({ data: payload });

    const result = await throttledGetDataFromApi('/posts/42');

    expect(result).toEqual(payload);
  });
});
