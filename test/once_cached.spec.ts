import { onceCached } from '../src/once_cached';

describe('onceCached', () => {
  it('should invoke function only once', () => {
    const fn = jest.fn();
    const fnWithCache = onceCached(fn);

    fnWithCache();
    fnWithCache();
    fnWithCache();
    fnWithCache();
    fnWithCache();
    fnWithCache();

    expect(fn).toBeCalledTimes(1);
  });

  it('should return the same result per every invocation', () => {
    const fn = jest.fn(() => Math.random());
    const fnWithCache = onceCached(fn);

    const result = fnWithCache();
    const result2 = fnWithCache();
    const result3 = fnWithCache();

    expect(result).toBe(result2);
    expect(result2).toBe(result3);
  });
});
