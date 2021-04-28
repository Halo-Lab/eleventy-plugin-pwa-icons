import * as pwaAssetGenerator from 'pwa-asset-generator';
import { ManifestJsonIcon } from 'pwa-asset-generator/dist/models/result';

import { makeDirectories } from './mkdir';

export type Options = Parameters<typeof pwaAssetGenerator.generateImages>[2];
export type LoggerFunction = Parameters<typeof pwaAssetGenerator.generateImages>[3];

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
export const generateImages = async ({
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
          pathOverride: publicDirectory,
          ...options,
        },
        logger
      )
    )
    .then(({ htmlMeta, manifestJsonContent }) => ({
      html: Object.values(htmlMeta).join(''),
      manifestJsonContent,
    }));
