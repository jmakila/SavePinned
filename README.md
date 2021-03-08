# SavePinned

A chrome extension to save and load groups of pinned tabs

## Features

- Save groups of pinned tabs
- Load groups of pinned tabs
- Autoload a group of pinned tabs on browser startup

## Installation

- [Chrome Web Store](https://chrome.google.com/webstore/detail/save-pinned-tabs/anmidgajdonkgmmilbccfefkfieajakd)

## Development

## Requirements

The following node modules are required for development

- ajv-cli
- browserify

### Modify Sets Schema

After modifying the schema of the sets object, update the JSON-Schema definition in `schema/sets.json`, then run the following commands to regenerate the validation script:

```
ajv compile -s schema/sets.json -o validate_sets.js && \
browserify validate_sets.js --standalone validate20 > lib/validate_sets_schema.min.js && \
rm validate_sets.js
```

### Launch extension in isolated chromium profile

- Create a new Chromium profile:
  - Linux: `npm run create-profile-chromium`
  - Mac OS: `npm run create-profile-chromium-mac`

- Run the extension within the new profile, saving data to the profile

  `npm run run-chromium`

### Launch extension in isolated firefox profile

- Create the new Firefox profile:
  - Linux: `npm run create-profile-firefox`
  - Mac OS: `npm run create-profile-firefox-mac`

- Run the extension within the new profile, saving data to the profile

  `npm run run-firefox`

  **Note: due to a bug in Firefox, this will not work properly on Mac OS and the extension must be installed and run manually**

### Build

- Set the version number in package.json

- Build the extension

  `npm run build`

- The extension will be built into `web-ext-artifacts/save_pinned_tabs-X.Y.Z.zip`
