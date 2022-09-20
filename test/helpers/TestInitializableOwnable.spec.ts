import { expectRevert } from "@openzeppelin/test-helpers";
import { ZERO_ADDRESS } from "@utils/constants";
import envSetup from "@utils/env_setup";
import { InitializableOwnableWrapperInstance } from "types/generated";

const InitializableOwnableWrapper = artifacts.require("InitializableOwnableWrapper");

const { expect } = envSetup.configure();

contract("InitializableOwnable", async (accounts) => {
    const [owner, user] = accounts;

    let initializableOwnableWrapper: InitializableOwnableWrapperInstance;

    before("before all", async () => {
        initializableOwnableWrapper = await InitializableOwnableWrapper.new();
    });

    describe("initialize", async () => {
        beforeEach("before all", async () => {
            initializableOwnableWrapper = await InitializableOwnableWrapper.new();
        });

        context("should succeed", async () => {
            it("when it's called first time", async () => {
                await initializableOwnableWrapper.initialize({ from: owner });

                const currOwner = await initializableOwnableWrapper.owner();
                expect(currOwner).to.equal(owner);
            });
        });

        context("should fail", async () => {
            it("when it's called second time", async () => {
                await initializableOwnableWrapper.initialize({ from: owner });

                await expectRevert.unspecified(initializableOwnableWrapper.initialize({ from: user }), "already initialized");
            });
        });
    });

    describe("renounceOwnership", async () => {
        beforeEach("before all", async () => {
            initializableOwnableWrapper = await InitializableOwnableWrapper.new();
        });

        it("should properly clear owner state", async () => {
            await initializableOwnableWrapper.initialize({ from: owner });

            let isCurrOwner = await initializableOwnableWrapper.isOwner({ from: owner });
            expect(isCurrOwner).to.equal(true);

            await initializableOwnableWrapper.renounceOwnership({ from: owner });
            isCurrOwner = await initializableOwnableWrapper.isOwner({ from: owner });
            expect(isCurrOwner).to.equal(false);
        });
    });

    describe("transferOwnership", async () => {
        beforeEach("before all", async () => {
            initializableOwnableWrapper = await InitializableOwnableWrapper.new();
        });

        context("should succeed", async () => {
            it("when it's called by owner", async () => {
                await initializableOwnableWrapper.initialize({ from: owner });

                await initializableOwnableWrapper.transferOwnership(user, { from: owner });
                const currOwner = await initializableOwnableWrapper.owner({ from: owner });
                expect(currOwner).to.equal(user);
            });
        });

        context("should fail", async () => {
            it("when it's not called by owner", async () => {
                await initializableOwnableWrapper.initialize({ from: owner });

                await expectRevert(initializableOwnableWrapper.transferOwnership(user, { from: user }), "caller is not the owner");
            });

            it("when new owner is zero address", async () => {
                await initializableOwnableWrapper.initialize({ from: owner });

                await expectRevert(
                    initializableOwnableWrapper.transferOwnership(ZERO_ADDRESS, { from: owner }),
                    "new owner is the zero address"
                );
            });
        });
    });
});
