import { expectRevert } from "@openzeppelin/test-helpers";
import { TokenInstance } from "types/generated";

const Token = artifacts.require("Token");
const {toWei} = web3.utils;

contract("Token", async (accounts) => {
    const [owner, user] = accounts;

    let token: TokenInstance;

    before("before all", async () => {
        token = await Token.new("Test Token", "TT", 18);
    });

    describe("mint", async () => {
        context("should succeed", async () => {
            it("when it's called by owner", async () => {
                await token.mint(user, toWei("100"), { from: owner });
            });
        });

        context("should fail", async () => {
            it("when it's not called by owner", async () => {
                await expectRevert(token.mint(user, toWei("100"), { from: user }), "caller is not the owner");
            });
        });
    });

    describe("burn", async () => {
        context("should succeed", async () => {
            it("when it's called by owner", async () => {
                await token.burn(user, toWei("50"), { from: owner });
            });
        });

        context("should fail", async () => {
            it("when it's not called by owner", async () => {
                await expectRevert(token.burn(user, toWei("50"), { from: user }), "caller is not the owner");
            });
        });
    });
});
