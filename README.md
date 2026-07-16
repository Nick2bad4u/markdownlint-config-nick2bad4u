# markdownlint-config-nick2bad4u

[![Continuous Integration](https://github.com/Nick2bad4u/markdownlint-config-nick2bad4u/actions/workflows/ci.yml/badge.svg)](https://github.com/Nick2bad4u/markdownlint-config-nick2bad4u/actions/workflows/ci.yml)

Shareable styles for David Anson's Node
[markdownlint](https://github.com/DavidAnson/markdownlint).

## Install

```sh
npm install --save-dev markdownlint-cli markdownlint-config-nick2bad4u
```

## Presets

| Preset        | Intended use                                                 |
| ------------- | ------------------------------------------------------------ |
| `recommended` | Practical source Markdown with selected semantic HTML.       |
| `strict`      | 100-column prose and no inline HTML.                         |
| `docs`        | Docusaurus/GFM documentation with a reviewed HTML allowlist. |
| `generated`   | Changelogs and generated API output with narrow relaxations. |

## Native `extends`

Create `.markdownlint.json` in the consumer:

```json
{
 "extends": "markdownlint-config-nick2bad4u/presets/docs.json",
 "MD013": false
}
```

Then run the Node CLI normally:

```json
{
 "scripts": {
  "lint:markdown": "markdownlint \"**/*.md\""
 }
}
```

The raw compatibility path
`node_modules/markdownlint-config-nick2bad4u/recommended.json` is also
available for `markdownlint --config`.

## JavaScript API

```js
import {
 createMarkdownlintConfig,
 getMarkdownlintConfigPath,
 loadMarkdownlintConfig,
} from "markdownlint-config-nick2bad4u";

const strict = await loadMarkdownlintConfig("strict");
const docsPath = getMarkdownlintConfigPath("docs");
const customized = createMarkdownlintConfig("recommended", { MD013: false });
```

## Important ecosystem distinction

This package targets the Node package named `markdownlint` and the
`markdownlint-cli`/`markdownlint-cli2` CLIs. It is not a style for the unrelated
Ruby `mdl` implementation published from `markdownlint/markdownlint`. Do not
pass these JSON files to Ruby `mdl --style`.

## Requirements

- Node.js `^22.22.3`, `^24.16.0`, or `>=26.3.0`
- markdownlint `^0.41.1`

## License

[MIT](LICENSE)
