import fs from 'fs';

import type { ManifestJsonIcon } from 'pwa-asset-generator/dist/models/result';

export interface UpdateManifestOptions {
  icons: ReadonlyArray<ManifestJsonIcon>;
  pathToManifest: string;
  pathToOutputManifest: string;
}

/** Update _icons_ property of manifest file. */
export const updateManifest = async ({
  icons,
  pathToManifest,
  pathToOutputManifest,
}: UpdateManifestOptions) =>
  fs.promises
    .readFile(pathToManifest, { encoding: 'utf-8' })
    .then(JSON.parse)
    .then((manifest) => ({
      ...manifest,
      icons: (manifest.icons || []).concat(icons),
    }))
    .then(JSON.stringify)
    .then((data) =>
      fs.promises.writeFile(pathToOutputManifest, data, { encoding: 'utf-8' })
    );
