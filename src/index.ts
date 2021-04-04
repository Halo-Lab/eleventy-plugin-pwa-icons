import { generateAndInsertIcons, PWAIconsOptions } from './transform_html';

/**
 * Generates splash screens and icons, favicons, mstile images for PWA.
 * Also fills `icons` property in the `manifest.json` file.
 */
export const icons = (
  config: Record<string, Function>,
  options: PWAIconsOptions
) => {
  config.addTransform('icons', async (content: string, outputPath: string) => {
    if (outputPath.endsWith('html')) {
      return generateAndInsertIcons(content, options);
    }

    return content;
  });
};

export { PWAIconsOptions };
