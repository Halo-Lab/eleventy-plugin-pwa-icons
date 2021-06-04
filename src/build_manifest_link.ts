import { makeUrlFromRoot } from './build_public_url';

/**
 * Builds link tag of manifest file to be
 * inserted into HTML.
 */
export const buildManifestLinkTag = (url: string) =>
  /* html */ `<link rel="manifest" href="${makeUrlFromRoot(
    url
  )}" crossorigin="use-credentials" />`;
