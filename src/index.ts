import { getOutputDirectory } from './get_build_directory';

import { isProduction } from './mode';
import { generateAndInsertIcons, PWAIconsOptions } from './transform_html';

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
): void => {
  if (enabled) {
    config.addTransform(
      'icons',
      async function (
        this: { outputPath: string },
        content: string,
        outputPath: string
      ): Promise<string> {
        const outputFilePath = this.outputPath ?? outputPath;

        return outputFilePath.endsWith('html')
          ? generateAndInsertIcons(
              content,
              getOutputDirectory(outputFilePath),
              {
                icons,
                logger,
                manifest,
                generatorOptions,
              }
            )
          : content;
      }
    );
  }
};

export { PWAIconsOptions };
