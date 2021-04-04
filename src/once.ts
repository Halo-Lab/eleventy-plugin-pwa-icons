/**
 * Executes fucntion only once.
 * If there will be multiple invokations,
 * then cached result will be returned.
 */
export const once = <F extends (...args: ReadonlyArray<any>) => any>(fn: F) => {
  let cache: ReturnType<F>;
  let done = false;
  return (...args: Parameters<F>) => {
    if (done) {
      return cache;
    } else {
      done = true;
      return (cache = fn(...args) as ReturnType<F>);
    }
  };
};
