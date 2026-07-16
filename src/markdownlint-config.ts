import type { UnknownRecord } from "type-fest";

import { fileURLToPath } from "node:url";
import { arrayIncludes, arrayJoin } from "ts-extras";

import docsConfig from "../presets/docs.json" with { type: "json" };
import generatedConfig from "../presets/generated.json" with { type: "json" };
import recommendedConfig from "../presets/recommended.json" with { type: "json" };
import strictConfig from "../presets/strict.json" with { type: "json" };

/** Portable markdownlint style configuration. */
export type MarkdownlintConfig = Readonly<
    Record<string, MarkdownlintRuleValue>
>;

/** Bundled policy choices. */
export type MarkdownlintPreset =
    | "docs"
    | "generated"
    | "recommended"
    | "strict";

/** Values accepted by a markdownlint style. */
export type MarkdownlintRuleValue =
    | boolean
    | null
    | number
    | Readonly<UnknownRecord>
    | readonly string[]
    | string;

/** All bundled preset names in stable display order. */
export const markdownlintPresets: readonly MarkdownlintPreset[] = Object.freeze(
    [
        "recommended",
        "strict",
        "docs",
        "generated",
    ]
);

const presetConfigs: Readonly<Record<MarkdownlintPreset, MarkdownlintConfig>> =
    {
        docs: docsConfig,
        generated: generatedConfig,
        recommended: recommendedConfig,
        strict: strictConfig,
    };

const presetPaths: Readonly<Record<MarkdownlintPreset, string>> = {
    docs: fileURLToPath(new URL("../presets/docs.json", import.meta.url)),
    generated: fileURLToPath(
        new URL("../presets/generated.json", import.meta.url)
    ),
    recommended: fileURLToPath(
        new URL("../presets/recommended.json", import.meta.url)
    ),
    strict: fileURLToPath(new URL("../presets/strict.json", import.meta.url)),
};

const isPreset = (value: unknown): value is MarkdownlintPreset =>
    arrayIncludes(markdownlintPresets, value);

/** Create a style with consumer rule overrides. */
export function createMarkdownlintConfig(
    preset: MarkdownlintPreset = "recommended",
    overrides: MarkdownlintConfig = {}
): MarkdownlintConfig {
    return structuredClone({ ...presetConfigs[preset], ...overrides });
}

/**
 * Return the absolute path to one bundled JSON style.
 *
 * @throws {@link RangeError} If `preset` is not bundled.
 */
export function getMarkdownlintConfigPath(
    preset: MarkdownlintPreset = "recommended"
): string {
    if (!isPreset(preset)) {
        throw new RangeError(
            `Unknown markdownlint preset: ${String(valueForMessage(preset))}. Expected one of: ${arrayJoin(markdownlintPresets, ", ")}.`
        );
    }
    return presetPaths[preset];
}

/** Load a fresh copy of one bundled style. */
export function loadMarkdownlintConfig(
    preset: MarkdownlintPreset = "recommended"
): Promise<MarkdownlintConfig> {
    return Promise.resolve(structuredClone(presetConfigs[preset]));
}

function valueForMessage(value: unknown): unknown {
    return value;
}

/** Recommended balanced style. */
const defaultConfig: MarkdownlintConfig = Object.freeze(
    createMarkdownlintConfig()
);

export default defaultConfig;
