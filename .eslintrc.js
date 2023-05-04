const { warn } = require("console");

module.exports = {
    env: {
        node: true,
        browser: true,
        jest: true,
        mocha: true,
    },
    extends: [
        "eslint:recommended",
        "prettier", // "prettier" should be last
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        project: "./tsconfig.json",
    },
    settings: {
        "import/resolver": {
            alias: {
                map: [
                    ["@utils", "./test-utils"],
                    ["types/generated", "./types/generated/index"],
                ],
                extensions: [".ts", ".d.ts", ".js", ".jsx", ".json"],
            },
        },
    },
    rules: { "no-unused-vars": "warn" },
};
