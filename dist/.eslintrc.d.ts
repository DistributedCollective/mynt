declare const _extends: string[];
export { _extends as extends };
export declare namespace env {
    const node: boolean;
    const browser: boolean;
    const jest: boolean;
}
export declare namespace parserOptions {
    const project: string;
}
export declare const settings: {
    "import/resolver": {
        alias: {
            map: string[][];
            extensions: string[];
        };
    };
};
export declare const rules: {
    "@typescript-eslint/no-use-before-define": number;
    "import/no-extraneous-dependencies": number;
    "@typescript-eslint/semi": number;
    "no-nested-ternary": number;
    "consistent-return": number;
    "no-param-reassign": number;
    "import/prefer-default-export": number;
    "lines-between-class-members": number;
    "@typescript-eslint/explicit-function-return-type": number;
    "@typescript-eslint/camelcase": string;
    "no-console": string;
};
export declare const overrides: {
    files: string[];
}[];
