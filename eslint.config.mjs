import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import _import from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import noOnlyTests from "eslint-plugin-no-only-tests";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["dist/*"]), {
    extends: fixupConfigRules(compat.extends(
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:prettier/recommended",
        "prettier",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
    )),

    plugins: {
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        import: fixupPluginRules(_import),
        prettier: fixupPluginRules(prettier),
        "no-only-tests": noOnlyTests,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: "module",

        parserOptions: {
            project: ["tsconfig.json", "test/tsconfig.json", "example/tsconfig.json"],
        },
    },

    settings: {
        jsdoc: {
            tagNamePreference: {
                returns: "return",
            },
        },

        "import/resolver": {
            node: {
                extensions: [".js", ".ts"],
            },
        },
    },

    rules: {
        "@typescript-eslint/adjacent-overload-signatures": "error",
        "@typescript-eslint/no-empty-function": "error",
        "@typescript-eslint/no-empty-interface": "warn",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-namespace": "error",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/prefer-for-of": "warn",
        "@typescript-eslint/triple-slash-reference": "error",
        "@typescript-eslint/unified-signatures": "warn",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-deprecated": "error",
        "constructor-super": "error",
        eqeqeq: ["warn", "always"],
        "import/no-deprecated": "warn",
        "import/no-extraneous-dependencies": "error",
        "import/no-unassigned-import": "warn",
        "no-cond-assign": "error",
        "no-duplicate-case": "error",
        "no-duplicate-imports": "error",

        "no-empty": ["error", {
            allowEmptyCatch: true,
        }],

        "no-invalid-this": "error",
        "no-new-wrappers": "error",
        "no-param-reassign": "error",
        "no-redeclare": "error",
        "no-sequences": "error",
        "no-throw-literal": "error",
        "no-unsafe-finally": "error",
        "no-unused-labels": "error",
        "no-var": "warn",
        "no-void": "error",
        "prefer-const": "warn",
        "no-only-tests/no-only-tests": "error",
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
    },
}]);