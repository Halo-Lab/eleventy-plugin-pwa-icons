import { sep } from 'path';

import { isProduction } from './mode';
import { generateAndInsertIcons, PWAIconsOptions } from './transform_html';

// Eleventy shows output path relative to current working directory,
// so we can get output directory as fist top-level directory.
let buildDirectory: string;

/**
 * Generates splash screens and icons, favicons, mstile images for PWA.
 * Also fills `icons` property in the `manifest.json` file.
 */
export const icons = (
  config: Record<string, Function>,
  {
    logger,
    icons = {},
    manifest = {},
    generatorOptions = {},
    enabled = isProduction(),
  }: PWAIconsOptions = {}
) => {
  if (enabled) {
    config.addTransform(
      'icons',
      async (content: string, outputPath: string) => {
        buildDirectory ??= outputPath.split(sep)[0];

        if (outputPath.endsWith('html')) {
          return generateAndInsertIcons(content, buildDirectory, {
            icons,
            logger,
            manifest,
            generatorOptions,
          });
        }

        return content;
      }
    );
  }
};

export { PWAIconsOptions };
