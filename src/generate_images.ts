import * as pwaAssetGenerator from 'pwa-asset-generator';

import { makeDirectories } from './mkdir';

export interface GenerateImageOptions {
  /** Path to the favicon file. */
  input: string;
  /** Path to directory of generated images. */
  output: string;
  publicDirectory: string;
}

/**
 * Generate icon and splash screen images,
 * favicons and mstile images.
 */
export const generateImages = async ({
  input,
  output,
  publicDirectory,
}: GenerateImageOptions) => {
  await makeDirectories(output);

  const {
    htmlMeta,
    manifestJsonContent,
  } = await pwaAssetGenerator.generateImages(input, output, {
    log: false,
    mstile: true,
    favicon: true,
    pathOverride: publicDirectory,
  });

  return { html: Object.values(htmlMeta).join(''), manifestJsonContent };
};
