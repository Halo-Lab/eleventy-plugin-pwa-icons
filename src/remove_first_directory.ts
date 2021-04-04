import path from 'path';

/** Discards first directory from _url_. */
export const removeFirstDirectory = (url: string) =>
  url.split(path.sep).slice(1).join(path.sep);
