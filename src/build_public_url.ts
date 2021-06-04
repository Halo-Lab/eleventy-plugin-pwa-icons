import { URL_DELIMITER } from './constants';

export const buildPublicUrl = (
  ...parts: ReadonlyArray<string | undefined>
): string =>
  parts
    .filter((part) => typeof part === 'string')
    .filter(Boolean)
    .join(URL_DELIMITER);

export const makeUrlFromRoot = (url: string): string =>
  url.startsWith(URL_DELIMITER) ? url : URL_DELIMITER + url;
