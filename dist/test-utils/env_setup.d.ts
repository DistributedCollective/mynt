/// <reference types="chai" />
/**
 * @notice This file configures the environment for testing
 */
declare class TestEnvironmentSetup {
    private isConfigured;
    constructor();
    configure(): Chai.ChaiStatic;
}
declare const _default: TestEnvironmentSetup;
export default _default;
