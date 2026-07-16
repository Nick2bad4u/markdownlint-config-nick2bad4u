import { lint, readConfig } from "markdownlint/sync";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import defaultConfig, {
    createMarkdownlintConfig,
    getMarkdownlintConfigPath,
    loadMarkdownlintConfig,
    type MarkdownlintPreset,
    markdownlintPresets,
} from "../src/markdownlint-config.js";

const validMarkdown = `# Fixture

This is a complete paragraph.

- One
- Two
`;

const fixture = { root: "" };

beforeAll(async () => {
    fixture.root = await mkdtemp(path.join(tmpdir(), "markdownlint-config-"));
});

afterAll(async () => {
    await rm(fixture.root, { force: true, recursive: true });
});

describe("markdownlint presets", () => {
    it.each(markdownlintPresets)("loads and lints with %s", async (preset) => {
        const configPath = getMarkdownlintConfigPath(preset);
        const config = await loadMarkdownlintConfig(preset);
        const results = lint({ config, strings: { fixture: validMarkdown } });

        expect(config).toStrictEqual(
            JSON.parse(await readFile(configPath, "utf8"))
        );
        expect(results["fixture"]).toStrictEqual([]);
    });

    it("keeps the default export aligned with recommended", async () => {
        expect(defaultConfig).toStrictEqual(await loadMarkdownlintConfig());
    });

    it("lets consumers override rules", () => {
        const config = createMarkdownlintConfig("strict", { MD013: false });

        expect(config["MD013"]).toBe(false);
        expect(config["MD033"]).toBe(true);
    });

    it("makes strict materially stricter than docs", async () => {
        const source = "# Fixture\n\n<div>allowed in docs</div>\n";
        const strict = lint({
            config: await loadMarkdownlintConfig("strict"),
            strings: { fixture: source },
        });
        const docs = lint({
            config: await loadMarkdownlintConfig("docs"),
            strings: { fixture: source },
        });

        expect(
            strict["fixture"]?.some(({ ruleNames }) =>
                ruleNames.includes("MD033")
            )
        ).toBe(true);
        expect(docs["fixture"]).toStrictEqual([]);
    });

    it("supports markdownlint's native extends loader", async () => {
        const consumerConfigPath = path.join(
            fixture.root,
            ".markdownlint.json"
        );
        await writeFile(
            consumerConfigPath,
            `${JSON.stringify({ extends: getMarkdownlintConfigPath("strict"), MD013: false })}\n`
        );

        const config = readConfig(consumerConfigPath);

        expect(config.MD013).toBe(false);
        expect(config.MD033).toBe(true);
    });

    it("rejects invented presets", () => {
        expect(() =>
            getMarkdownlintConfigPath("blog" as MarkdownlintPreset)
        ).toThrow(RangeError);
    });

    it("runs the real Node markdownlint CLI", async () => {
        const markdownPath = path.join(fixture.root, "README.md");
        await writeFile(markdownPath, validMarkdown);
        const cliPath = fileURLToPath(
            new URL(
                "../node_modules/markdownlint-cli/markdownlint.js",
                import.meta.url
            )
        );
        const result = spawnSync(
            process.execPath,
            [
                cliPath,
                "--config",
                getMarkdownlintConfigPath("recommended"),
                markdownPath,
            ],
            { encoding: "utf8" }
        );

        expect(result.status).toBe(0);
    });
});
