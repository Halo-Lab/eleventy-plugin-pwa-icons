import { resolve, join } from 'path';

import * as pwaAssetGenerator from 'pwa-asset-generator';
import { ManifestJsonIcon } from 'pwa-asset-generator/dist/models/result';

import { onceCached } from './once_cached';
import { makeDirectories } from './mkdir';
import { makeUrlFromRoot } from './build_public_url';
import { TransformOptions } from './types';
import { done, oops, start } from './pretty';
import {
  DEFAULT_IMAGE_NAME,
  DEFAULT_ICONS_DIRECTORY,
  DEFAULT_SOURCE_DIRECTORY,
} from './constants';

export type Options = Parameters<typeof pwaAssetGenerator.generateImages>[2];
export type LoggerFunction = Parameters<
  typeof pwaAssetGenerator.generateImages
>[3];

export interface GenerateImageOptions {
  /** Path to the favicon file. */
  input: string;
  /** Path to directory of generated images. */
  output: string;
  /** An optional logger to log the result. */
  logger: LoggerFunction;
  /** Options for PWA image generator. */
  options: Options;
  publicDirectory: string;
}

export interface ImageResult {
  html: string;
  manifestJsonContent: ReadonlyArray<ManifestJsonIcon>;
}

/**
 * Generate icon and splash screen images,
 * favicons and mstile images.
 */
const generateImages = async ({
  input,
  output,
  logger,
  options,
  publicDirectory,
}: GenerateImageOptions): Promise<ImageResult> =>
  makeDirectories(output)
    .then(() =>
      pwaAssetGenerator.generateImages(
        input,
        output,
        {
          log: false,
          mstile: true,
          favicon: true,
          pathOverride: makeUrlFromRoot(publicDirectory),
          ...options,
        },
        logger
      )
    )
    .then(({ htmlMeta, manifestJsonContent }) => ({
      html: Object.values(htmlMeta).join(''),
      manifestJsonContent,
    }));

export const handleImages = onceCached(
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

    const absolutePathToRawImage = resolve(
      icons.pathToRawImage ?? join(DEFAULT_SOURCE_DIRECTORY, DEFAULT_IMAGE_NAME)
    );
    const outputIconsDirectory = resolve(
      buildDirectory,
      icons.publicDirectory ?? DEFAULT_ICONS_DIRECTORY
    );

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
