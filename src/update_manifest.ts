import { promises } from 'fs';
import { join, resolve, basename } from 'path';

import { pipe } from '@fluss/core';
import { ManifestJsonIcon } from 'pwa-asset-generator/dist/models/result';

import { onceCached } from './once_cached';
import { done, oops } from './pretty';
import { TransformOptions } from './types';
import { buildPublicUrl, makeUrlFromRoot } from './build_public_url';
import { DEFAULT_MANIFEST_NAME, DEFAULT_SOURCE_DIRECTORY } from './constants';

export interface UpdateManifestOptions {
  icons: ReadonlyArray<ManifestJsonIcon>;
  pathToManifest: string;
  pathToOutputManifest: string;
}

/** Update _icons_ property of manifest file. */
const updateManifest = async ({
  icons,
  pathToManifest,
  pathToOutputManifest,
}: UpdateManifestOptions) =>
  promises
    .readFile(pathToManifest, { encoding: 'utf-8' })
    .then(JSON.parse)
    .then((manifest) => ({
      ...manifest,
      icons: (manifest.icons || []).concat(icons),
    }))
    .then(JSON.stringify)
    .then((data) =>
      promises.writeFile(pathToOutputManifest, data, { encoding: 'utf-8' })
    );

export const handleManifest = onceCached(
  async (
    manifestJsonContent: ReadonlyArray<ManifestJsonIcon>,
    {
      manifest = {},
      buildDirectory,
    }: Pick<TransformOptions, 'manifest'> & { buildDirectory: string }
  ) => {
    const pathToManifest = resolve(
      manifest.pathToManifest ??
        join(DEFAULT_SOURCE_DIRECTORY, DEFAULT_MANIFEST_NAME)
    );

    const manifestName = basename(pathToManifest);

    const pathToOutputManifest = resolve(
      buildDirectory,
      manifest.publicDirectory ?? '',
      manifestName
    );

    await updateManifest({
      pathToManifest,
      icons: manifestJsonContent,
      pathToOutputManifest,
    }).catch(oops);

    done('Manifest was successfully updated and moved to build directory');

    return (pipe(buildPublicUrl, makeUrlFromRoot) as (
      ...args: ReadonlyArray<string | undefined>
    ) => string)(manifest.publicDirectory, manifestName);
  }
);
