import path from 'path';

import chalk from 'chalk';
import { ManifestJsonIcon } from 'pwa-asset-generator/dist/models/result';

import { once } from './once';
import { updateManifest } from './update_manifest';
import { buildManifestLinkTag } from './build_manifest_link';
import { done, oops, start, warn } from './pretty';
import {
  DEFAULT_IMAGE_NAME,
  DEFAULT_MANIFEST_NAME,
  DEFAULT_ICONS_DIRECTORY,
  DEFAULT_SOURCE_DIRECTORY,
} from './constants';
import {
  Options,
  generateImages,
  LoggerFunction,
  GenerateImageOptions,
} from './generate_images';

interface TransformOptions {
  icons?: {
    /**
     * Path to source image for PWA icons.
     * By default, it is `src/icon.png`.
     *
     * Should be relative to _current working directory_.
     */
    pathToRawImage?: string;
    /**
     * Directory to which output PWA icons.
     *
     * Should be relative to _current working directory_.
     *
     * @deprecated in favour of _publicDirectory_.
     */
    outputDirectory?: string;
    /**
     * Public directory into which to output all PWA icons.
     *
     * Should be relative to _output_ directory.
     */
    publicDirectory?: string;
  };
  manifest?: {
    /**
     * Path to `manifest.json` file.
     * By default, it is `src/manifest.json`.
     *
     * Should be relative to _current working directory_.
     */
    pathToManifest?: string;
    /**
     * Directory to which output updated `manifest.json`.
     *
     * Should be relative to _current working directory_.
     *
     * @deprecated in favour of _publicDirectory_.
     */
    outputDirectory?: string;
    /**
     * Public directory into which to output updated `manifest.json`.
     *
     * Should be relative to _output_ directory.
     */
    publicDirectory?: string;
  };
}

export type PWAIconsOptions = TransformOptions & {
  logger?: LoggerFunction;
  /** Decide whether plugin should do its work. */
  enabled?: boolean;
  generatorOptions?: Options;
};

const handleImages = once(
  ({
    icons = {},
    logger,
    options,
    buildDirectory,
  }: Pick<TransformOptions, 'icons'> & { buildDirectory: string } & Pick<
      GenerateImageOptions,
      'logger' | 'options'
    >) => {
    start('Starting icons generation');

    const absolutePathToRawImage = path.resolve(
      icons.pathToRawImage ??
        path.join(DEFAULT_SOURCE_DIRECTORY, DEFAULT_IMAGE_NAME)
    );
    const outputIconsDirectory = path.resolve(
      icons.outputDirectory ??
        path.join(
          buildDirectory,
          icons.publicDirectory ?? DEFAULT_ICONS_DIRECTORY
        )
    );
    if (icons.outputDirectory !== undefined) {
      warn(
        `${chalk.bold(
          'icons.outputDirectory'
        )} option is deprecated. Use ${chalk.bold(
          'icons.publicDirectory'
        )} instead.`
      );
    }

    return generateImages({
      input: absolutePathToRawImage,
      output: outputIconsDirectory,
      publicDirectory: icons.publicDirectory ?? DEFAULT_ICONS_DIRECTORY,
      options,
      logger,
    }).then(
      (info) => {
        done('Icons for PWA were successfully generated');
        return info;
      },
      (error) => {
        oops(error);
        return { html: '', manifestJsonContent: [] };
      }
    );
  }
);

const handleManifest = once(
  async (
    manifestJsonContent: ReadonlyArray<ManifestJsonIcon>,
    {
      manifest = {},
      buildDirectory,
    }: Pick<TransformOptions, 'manifest'> & { buildDirectory: string }
  ) => {
    const pathToManifest = path.resolve(
      manifest.pathToManifest ??
        path.join(DEFAULT_SOURCE_DIRECTORY, DEFAULT_MANIFEST_NAME)
    );

    const manifestName = path.basename(pathToManifest);

    const pathToOutputManifest = path.resolve(
      manifest.outputDirectory ??
        path.join(buildDirectory, manifest.publicDirectory ?? ''),
      manifestName
    );

    if (manifest.outputDirectory !== undefined) {
      warn(
        `${chalk.bold(
          'manifest.outputDirectory'
        )} is deprecated. Use ${chalk.bold(
          'manifest.publicDirectory'
        )} instead.`
      );
    }

    await updateManifest({
      pathToManifest,
      icons: manifestJsonContent,
      pathToOutputManifest,
    }).catch(oops);

    done('Manifest was successfully updated and moved to build directory');

    return path.join(manifest.publicDirectory ?? '', manifestName);
  }
);

/**
 * Transform function that inserts links of PWA images
 * into HTML file and updates manifest file.
 */
export const generateAndInsertIcons = async (
  html: string,
  buildDirectory: string,
  { icons, manifest, generatorOptions: options, logger }: PWAIconsOptions
) => {
  const { html: imagesHTML, manifestJsonContent } = await handleImages({
    icons,
    buildDirectory,
    options,
    logger,
  });

  const manifestPublicUrl = await handleManifest(manifestJsonContent, {
    manifest,
    buildDirectory,
  });

  const htmlWithIcons = html
    .replace('</head>', buildManifestLinkTag(manifestPublicUrl) + '</head>')
    .replace('</head>', imagesHTML + '</head>');

  done('Links of generated icons were injected into HTML');

  return htmlWithIcons;
};
