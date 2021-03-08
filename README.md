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

```
ajv compile -s schema/sets.json -o validate_sets.js && \
browserify validate_sets.js --standalone validate20 > lib/validate_sets_schema.min.js && \
rm validate_sets.js
```

### Launch extension in isolated chromium profile

- Create a new Chromium profile:

  `npm run create-profile-chromium`

- Run the extension within the new profile, saving data to the profile

  `npm run run-chromium`

### Launch extension in isolated firefox profile

- Create the new Firefox profile:

  `npm run create-profile-firefox`

- Run the extension within the new profile, saving data to the profile

  `npm run run-firefox`

### Build

- Set the version number in package.json

- Build the extension

  `npm run build`

- The extension will be built into `web-ext-artifacts/save_pinned_tabs-X.Y.Z.zip`
