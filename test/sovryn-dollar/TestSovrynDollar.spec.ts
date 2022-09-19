import { expectRevert, expectEvent } from "@openzeppelin/test-helpers";
import { toWei } from "web3-utils";
import { SovrynDollarTokenInstance } from "types/generated";
import { ZERO_ADDRESS } from "@utils/constants";

const SovrynDollarToken = artifacts.require("SovrynDollarToken");
const MockApprovalReceiver = artifacts.require("MockApprovalReceiver");
const NOT_OWNER_EXCEPTION = 'VM Exception while processing transaction: reverted with reason string \'Ownable: caller is not the owner';

const tokenName = "Sovryn Dollar";
const tokenSymbol = "DLLR";
const decimals = 18;

contract("SovrynDollarToken", async (accounts) => {
    const [owner, user, myntAssetProxy, myntAssetImplementation, myntBasketManagerProxy, myntBasketManagerImplementation] = accounts;

    let token: SovrynDollarTokenInstance;

    beforeEach("before all", async () => {
        token = await SovrynDollarToken.new({ from: owner });
        await token.setMyntAssetConfig(myntAssetProxy, myntAssetImplementation, { from: owner });
    });

    describe("deployment", async() => {
      it("should have correct name", async() => {
        expect(await token.name()).to.equal(tokenName);
      })

      it("should have correct symbol", async() => {
        expect(await token.symbol()).to.equal(tokenSymbol);
      })

      it("should have correct decimal", async() => {
        expect( (await token.decimals()).toNumber()).to.equal(decimals);
      })
    })

    describe("setMyntAssetConfig", async () => {
        context("should fail", async () => {
            it("when it's not called by owner", async () => {
                await expectRevert(
                    token.setMyntAssetConfig(myntAssetProxy, myntAssetImplementation, { from: user }), NOT_OWNER_EXCEPTION);
            });
        });
        context("should succeed", async () => {
            it("when called by owner", async () => {
                const tx = await token.setMyntAssetConfig(myntAssetProxy, myntAssetImplementation, { from: owner });

                expectEvent(tx, 'MyntAssetConfigChanged', { _newMyntAssetProxy: myntAssetProxy, _newMyntAssetImplementation: myntAssetImplementation });

                const [newMyntAssetProxyPromised, newMyntAssetImplementationPromised] = await Promise.all([token.myntAssetProxy(), token.myntAssetImplementation()]);
                expect(newMyntAssetProxyPromised).to.equal(myntAssetProxy);
                expect(newMyntAssetImplementationPromised).to.equal(myntAssetImplementation);
            });
        });
    });

    describe("setMyntBasketManagerConfig", async () => {
      context("should fail", async () => {
          it("when it's not called by owner", async () => {
              await expectRevert(
                  token.setMyntBasketManagerConfig(myntBasketManagerProxy, myntBasketManagerImplementation, { from: user }), NOT_OWNER_EXCEPTION);
          });
      });
      context("should succeed", async () => {
          it("when called by owner", async () => {
              const tx = await token.setMyntBasketManagerConfig(myntBasketManagerProxy, myntBasketManagerImplementation, { from: owner });

              expectEvent(tx, 'MyntBasketManagerConfigChanged', { _newMyntBasketManagerProxy: myntBasketManagerProxy, _newMyntBasketManagerImplementation: myntBasketManagerImplementation });

              const [newMyntBasketManagerProxyPromised, newMyntBasketManagerImplementationPromised] = await Promise.all([token.myntBasketManagerProxy(), token.myntBasketManagerImplementation()]);
              expect(newMyntBasketManagerProxyPromised).to.equal(myntBasketManagerProxy);
              expect(newMyntBasketManagerImplementationPromised).to.equal(myntBasketManagerImplementation);
          });
      });
    });

    describe("mint", async () => {
        context("should fail", async () => {
            it("when it's not called by mynt mAsset proxy", async () => {
                await expectRevert(
                    token.mint(user, toWei("100"), { from: user }),
                    "DLLR:unathorized mAsset proxy",
                );
            });
        });

        context("should succeed", async () => {
            it("when it's called by presale", async () => {
                const mintAmount = toWei("100");
                const initialBalance = await token.balanceOf(user);
                expect(initialBalance.toString()).to.equal("0");

                const tx = await token.mint(user, mintAmount, { from: myntAssetProxy });
                expectEvent(tx, 'Transfer', { from: ZERO_ADDRESS, to: user, value: mintAmount});

                const latestBalance = await token.balanceOf(user);
                expect(latestBalance.toString()).to.equal(mintAmount);
            });
        });
    });

    describe("burn", async () => {
        context("should fail", async () => {
            it("when it's not called by presale or by a user", async () => {
                await expectRevert(
                    token.burn(user, toWei("50"), { from: owner }),
                    "DLLR:unathorized mAsset proxy",
                );
            });
        });

        context("should succeed", async () => {
            it("when it's called by mynt mAsset proxy", async () => {
                const amount = toWei("50");
                await token.mint(user, amount, { from: myntAssetProxy });

                // amount after mint
                const initialBalance = await token.balanceOf(user);
                expect(initialBalance.toString()).to.equal(amount);

                const tx = await token.burn(user, amount, { from: myntAssetProxy });
                expectEvent(tx, 'Transfer', { from: user, to: ZERO_ADDRESS, value: amount});

                // amount after burn
                const latestBalance = await token.balanceOf(user);
                expect(latestBalance.toString()).to.equal("0");
            });
        });
    });

    describe("approveAndCall", async () => {

        let approvalReceiver;

        before(async () => {
            approvalReceiver = await MockApprovalReceiver.new();
        });

        it("should approve for transfer and call the receiver", async () => {
            const amount = toWei("50");
            const tx = await token.approveAndCall(approvalReceiver.address, amount, '0x1234');
            await expectEvent(tx, "Approval", { owner, spender: approvalReceiver.address, value: amount});
            expect(await approvalReceiver.sender(), 'sender').eq(owner);
            expect((await approvalReceiver.amount()).toString(), 'amount').eq(amount);
            expect(await approvalReceiver.token(), 'token').eq(token.address);
            expect(await approvalReceiver.data(), 'data').eq('0x1234');
        });
    });
});
