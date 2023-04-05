"use strict";
module.exports = {
    extends: [
        "airbnb-typescript",
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "prettier/@typescript-eslint",
    ],
    env: {
        node: true,
        browser: true,
        jest: true,
    },
    parserOptions: {
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
    rules: {
        "@typescript-eslint/no-use-before-define": 1,
        "import/no-extraneous-dependencies": 0,
        "@typescript-eslint/semi": 1,
        "no-nested-ternary": 0,
        "consistent-return": 0,
        "no-param-reassign": 0,
        "import/prefer-default-export": 0,
        "lines-between-class-members": 0,
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/camelcase": "off",
        "no-console": "off",
    },
    overrides: [
        {
            files: [
                "./types/*.ts",
                "./types/contracts.ts",
                "./types/chai.d.ts",
                "./types/interfaces.d.ts",
                "./types/**/*.ts",
                "./test/*.ts",
                "./scripts/**/*.ts",
                "./test/**/*.ts",
                "./tasks/**/*.ts",
                "./tasks",
                "./test-utils/*.ts",
                "./test-utils/**/*.ts",
                "./migrations/*.js",
                "./deployment/deploy/*.ts",
            ],
        },
    ],
};
//# sourceMappingURL=.eslintrc.js.map