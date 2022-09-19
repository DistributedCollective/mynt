import { expectRevert } from "@openzeppelin/test-helpers";

import { InitializableReentrancyMockInstance } from "types/generated";

const ReentrantMock = artifacts.require("ReentrantMock");
const NonReentrantMock = artifacts.require("NonReentrantMock");
const InitializableReentrancyMock = artifacts.require("InitializableReentrancyMock");

contract("InitializableReentrancyGuard", async (accounts) => {
    const [owner] = accounts;

    let initializableReentrancyMock: InitializableReentrancyMockInstance;

    describe("initialize", async () => {
        beforeEach("before", async () => {
            initializableReentrancyMock = await InitializableReentrancyMock.new();
        });

        context("should succeed", async () => {
            it("without reentrancy", async () => {
                const nonReentrantMock = await NonReentrantMock.new();
                await initializableReentrancyMock.initialize({ from: owner });

                await initializableReentrancyMock.runClientMethod(nonReentrantMock.address, {
                    from: owner,
                });
            });
        });

        context("should fail", async () => {
            beforeEach("before", async () => {
                initializableReentrancyMock = await InitializableReentrancyMock.new();
            });

            it("in case of reentrancy", async () => {
                const reentrantMock = await ReentrantMock.new(initializableReentrancyMock.address);

                await initializableReentrancyMock.initialize({ from: owner });
                await expectRevert(
                    initializableReentrancyMock.runClientMethod(reentrantMock.address, {
                        from: owner,
                    }),
                    "reentrant call",
                );
            });

            it("when it's not initialized", async () => {
                const nonReentrantMock = await NonReentrantMock.new();

                await expectRevert(
                    initializableReentrancyMock.runClientMethod(nonReentrantMock.address, {
                        from: owner,
                    }),
                    "reentrant call",
                );
            });
        });
    });
});
