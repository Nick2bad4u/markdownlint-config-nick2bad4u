# Repository Instructions

This repository publishes `markdownlint-config-nick2bad4u`.

## Public surfaces

- Treat `markdownlint.json`, `presets/`, and the typed API as public.
- Preserve native Node markdownlint `extends` resolution from installed packages.
- Keep the generated preset narrowly relaxed; do not turn it into a global bypass.
- Never confuse Node markdownlint configuration with Ruby `mdl` styles.

## Verification

Run `npm run release:verify`, including library lint, native extends loading, and
the real Node CLI in a clean fixture.
