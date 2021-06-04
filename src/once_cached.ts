/**
 * Executes function only once.
 * If there will be multiple invocations,
 * then cached result will be returned.
 */
export const onceCached = <F extends (...args: ReadonlyArray<any>) => any>(
  fn: F
): F => {
  const uniqueSymbol = Symbol();
  let cache: ReturnType<F> | symbol = uniqueSymbol;

  return ((...args: Parameters<F>) =>
    cache !== uniqueSymbol
      ? (cache as ReturnType<F>)
      : (cache = fn(...args) as ReturnType<F>)) as F;
};
