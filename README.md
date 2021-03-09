# SavePinned

A chrome extension to save and load groups of pinned tabs

## Features

- Save groups of pinned tabs
- Load groups of pinned tabs
- Autoload a group of pinned tabs on browser startup

## Installation

- [Chrome](https://chrome.google.com/webstore/detail/save-pinned-tabs/anmidgajdonkgmmilbccfefkfieajakd)

- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/save-pinned-tabs/)

- [Edge](https://microsoftedge.microsoft.com/addons/detail/ahejjkehekfnjbpaaochgfbmbajocdkn)

## Development

## Requirements

The following node modules are required for development

- ajv-cli
- browserify

### Modify Sets Schema

After modifying the schema of the sets object, update the JSON-Schema definition in `schema/sets.json`, then run the following commands to regenerate the validation script:

`npm run compile-sets-schema`

### Launch extension in isolated browser profile

- Create a new browser profile:

  - Chromium: `npm run new-profile:chromium`
  - Chromium Mac OS: `npm run new-profile:chromium-mac`
  - Firefox: `npm run new-profile:firefox`
  - Firefox Mac OS: `npm run new-profile:firefox-mac`
  - Brave: `npm run new-profile:brave`
  - Brave: `npm run new-profile:vivaldi`

- Run the extension within the new profile, saving data to the profile

  - Chromium: `npm run run:chromium`
  - Chromium Mac OS: `npm run run:chromium-mac`
  - Firefox: `npm run run:firefox`
  - Firefox Mac OS: `npm run run:firefox-mac`
  - Brave: `npm run run:brave`
  - Brave: `npm run run:vivaldi`

### Build

- Set the version number in package.json
-
- Set the version number in manifest.json

- Build the extension

  `npm run build`

- The extension archive will be saved to `dist/save_pinned_tabs-X.Y.Z.zip`
