# eleventy-plugin-pwa-icons 🎨

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Generates icon and splash screen images, favicons and mstile images. Updates `manifest.json` and every HTML file with the generated images according to [Web App Manifest specs](https://www.w3.org/TR/appmanifest/) and [Apple Human Interface guidelines](https://developer.apple.com/design/human-interface-guidelines/).

## Intention

Every [PWA](https://en.wikipedia.org/wiki/Progressive_web_application) needs icons either it is aimed for a mobile or a desktop application 💁‍♂️

## Get started

> This plugin uses [`pwa-assets-generator`](https://github.com/onderceylan/pwa-asset-generator) under the hood, so, we recommend to read about it first 🥸.
>
> Also we do not allow to customize generator's behavior, except for our own options. _This may change in future_, so stay with us ✊!

### Installation

At first run:

```sh
npm i -D eleventy-plugin-pwa-icons
```

and eventually add to Eleventy as plugin:

```js
const { icons } = require('eleventy-plugin-pwa-icons');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(icons, {
    /* Optional options. */
  });
};
```

### Options

The plugin can accept following options:

```ts
interface PWAIconsOptions {
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
```

> It is assumed that _outputDirectory_ is also in Eleventy's _build_ directory. [By default its name is `_site`.](https://www.11ty.dev/docs/config/#output-directory)

By default, path to image is _src/icon.png_ and output for icons is \__site/icons/_.

Default path for manifest is _src/manifest.json_ and output - \__site/manifest.json_.

That is all 👐 The plugin will do a remaining dirty job by itself.

## Word from author

Have fun! ✌️

<a href="https://www.halo-lab.com/?utm_source=github-brifinator-3000">
    <img src="https://api.halo-lab.com/wp-content/uploads/dev_halo.svg" alt="Developed in Halo lab" height="60">
</a>
