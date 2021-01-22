# SavePinned

A chrome extension to save and load groups of pinned tabs

## Features

- Save groups of pinned tabs
- Load groups of pinned tabs
- Autoload a group of pinned tabs on browser startup

## Installation

- [Chrome Web Store](https://chrome.google.com/webstore/detail/save-pinned-tabs/anmidgajdonkgmmilbccfefkfieajakd)

## Development

### Requirements

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

### Building Release

Run the following command to package the extension:

```
zip -r -FS ../SavePinnedTabs.xpi * --exclude '*.git*'
```
