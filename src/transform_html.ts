import path from 'path';

import { ManifestJsonIcon } from 'pwa-asset-generator/dist/models/result';

import { once } from './once';
import { generateImages } from './generate_images';
import { updateManifest } from './update_manifest';
import { done, oops, start } from './pretty';
import { buildManifestLinkTag } from './build_manifest_link';
import { removeFirstDirectory } from './remove_first_directory';
import {
  PLUGIN_NAME,
  DEFAULT_IMAGE_NAME,
  DEFAULT_MANIFEST_NAME,
  DEFAULT_ICONS_DIRECTORY,
  DEFAULT_BUILD_DIRECTORY,
  DEFAULT_SOURCE_DIRECTORY,
} from './constants';

export interface PWAIconsOptions {
  icons?: {
    /**
     * Path to source image for PWA icons.
     *
     * Should be relative to _current working directory_.
     */
    pathToRawImage?: string;
    /**
     * Directory to which output PWA icons.
     *
     * Should be relative to _current working directory_.
     */
    outputDirectory?: string;
  };
  manifest?: {
    /**
     * Path to `manifest.json` file.
     *
     * Should be relative to _current working directory_.
     */
    pathToManifest?: string;
    /**
     * Directory to which output updated `manifest.json`.
     *
     * Should be relative to _current working directory_.
     */
    outputDirectory?: string;
  };
}

const handleImages = once(({ icons = {} }: PWAIconsOptions) => {
  start(PLUGIN_NAME, 'Starting icons generation');

  const pathToRawImage = path.resolve(
    icons.pathToRawImage ??
      path.join(DEFAULT_SOURCE_DIRECTORY, DEFAULT_IMAGE_NAME)
  );
  const outputIconsDirectory = path.resolve(
    icons.outputDirectory ??
      path.join(DEFAULT_BUILD_DIRECTORY, DEFAULT_ICONS_DIRECTORY)
  );
  const outputIconsPublicDirectory = removeFirstDirectory(
    icons.outputDirectory ??
      path.join(DEFAULT_BUILD_DIRECTORY, DEFAULT_ICONS_DIRECTORY)
  );

  return generateImages({
    input: pathToRawImage,
    output: outputIconsDirectory,
    publicDirectory: outputIconsPublicDirectory,
  }).then(
    (info) => {
      done(PLUGIN_NAME, 'Icons for PWA were successfully generated');
      return info;
    },
    (error) => {
      oops(PLUGIN_NAME, error);
      return { html: '', manifestJsonContent: [] };
    }
  );
});

const handleManifest = once(
  async (
    manifestJsonContent: ReadonlyArray<ManifestJsonIcon>,
    { manifest = {} }: PWAIconsOptions
  ) => {
    const pathToManifest = path.resolve(
      manifest.pathToManifest ??
        path.join(DEFAULT_SOURCE_DIRECTORY, DEFAULT_MANIFEST_NAME)
    );
    const outputManifestDirectory = path.resolve(
      manifest.outputDirectory ?? path.join(DEFAULT_BUILD_DIRECTORY)
    );

    const manifestName = path.basename(pathToManifest);
    const publicManifestDirectory = removeFirstDirectory(
      manifest.outputDirectory ?? path.join(DEFAULT_BUILD_DIRECTORY)
    );
    const manifestPublicUrl = path.join(publicManifestDirectory, manifestName);

    await updateManifest({
      icons: manifestJsonContent,
      pathToManifest,
      pathToOutputManifest: path.join(outputManifestDirectory, manifestName),
    }).catch((error) => oops(PLUGIN_NAME, error));

    done(
      PLUGIN_NAME,
      'Manifest was successfully updated and moved to build directory'
    );

    return manifestPublicUrl;
  }
);

/**
 * Transform function that inserts links of PWA images
 * into HTML file and updates manifest file.
 */
export const generateAndInsertIcons = async (
  html: string,
  { icons = {}, manifest = {} }: PWAIconsOptions = {}
) => {
  const cache = await handleImages({ icons });

  const manifestPublicUrl = await handleManifest(cache.manifestJsonContent, {
    manifest,
  });

  const htmlWithIcons = html
    .replace('</head>', buildManifestLinkTag(manifestPublicUrl) + '</head>')
    .replace('</head>', cache.html + '</head>');

  done(PLUGIN_NAME, 'Links of generated icons were injected into HTML');

  return htmlWithIcons;
};
