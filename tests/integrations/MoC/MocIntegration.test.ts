import { signERC2612Permit } from "eth-permit";
// const permission = await signERC2612Permit(alice_signer, nueMockToken.address, alice_signer.address, borrowerOperations.address, decreaseAmount.toString());

// import { expect } from "chai";
import hre, { deployments, expect } from "hardhat"; // expect => https://hardhat.org/hardhat-chai-matchers/docs/reference
// import { FakeContract, smock } from "@defi-wonderland/smock";
import {
    DLLR,
    MassetManager,
    MocIntegration,
    BasketManagerV3,
    MocMock,
    MockERC20,
    Permit2
} from "types/generated";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { setBalance } from "@nomicfoundation/hardhat-network-helpers"; // https://hardhat.org/hardhat-network-helpers/docs/reference
import { ZERO_ADDRESS } from "@utils/constants";
import  { AllowanceProvider, PermitTransferFrom, SignatureTransfer } from "@uniswap/permit2-sdk";
import { BN } from "@openzeppelin/test-helpers";

function toDeadline(expiration: number): number {
    return Math.floor((Date.now() + expiration) / 1000)
}

function generateNonce() {
  return new BN(Math.floor(Date.now() + Math.random() * 100));
}

function extractSignature(signature: string) {
    const r = signature.slice(0, 66);
    const s = '0x' + signature.slice(66, 130);
    const v = '0x' + signature.slice(130, 132);

    return {v, r, s};
}

function bitmapPositions(nonce) {
  // Simulate logic to calculate wordPos and bitPos based on nonce
  const wordPos = Math.floor(nonce / 256);
  const bitPos = nonce % 256;
  return { wordPos, bitPos };
}

async function isUsedNonce(permit2, from, nonce) {
  const { wordPos, bitPos } = bitmapPositions(nonce);
  const bit = BigInt(1) << BigInt(bitPos);

  const nonceBitmapOnchain = BigInt((await permit2.nonceBitmap(from, wordPos)));
  const flipped = nonceBitmapOnchain ^ bit;

  if ((flipped & bit) === BigInt(0)) {
    return true;
  }

  return false;
}

describe("MoC Integration", async () => {
    // let mocFake: FakeContract<IMocMintRedeemDoc>;
    let moc: MocMock;
    let mocIntegration: MocIntegration;
    let alice: SignerWithAddress;
    let accounts: SignerWithAddress[];
    let dllr: DLLR;
    let massetManager: MassetManager;
    let basketManager: BasketManagerV3;
    let bAssetZusd: MockERC20;
    let bAssetDoc: MockERC20;
    let permit2: Permit2;
    const { ethers } = hre;

    // to test DLLR -> DoC -> RBTC
    // instantiation:
    // deploy DLLR, MassetManager, BasketManager, 2 'bAsset' ERC20 tokens - ZUSD and DoC, MoC fake main contract mocFake
    // initialize BasketManager with MassetManager and vice versa and with bAsstes
    // 1) user3
    // get DLLR: user1 deposits DoC and gets DLLR
    //

    before("before", async () => {
        accounts = await ethers.getSigners();
    });

    beforeEach("before all", async () => {
        await deployments.fixture([
            "MyntAdminProxy",
            "DLLR",
            "MassetManager",
            "BasketManager",
            "MocIntegration",
            "Permit2",
        ]);

        [, alice] = accounts;

        // const mocFactory = await ethers.getContractFactory("MocMock");
        // moc = (await mocFactory.deploy()) as MocMock;

        dllr = (await ethers.getContract("DLLR")) as DLLR;
        massetManager = (await ethers.getContract("MassetManager")) as MassetManager;
        basketManager = (await ethers.getContract("BasketManagerV3")) as BasketManagerV3;
        mocIntegration = (await ethers.getContract("MocIntegration")) as MocIntegration;
        permit2 = (await ethers.getContract("Permit2")) as Permit2;

        // bAssetDoc = (await ethers.getContract("DoC")) as MockERC20;
        bAssetDoc = await ethers.getContractAt("MockERC20", await mocIntegration.doc());
        moc = (await ethers.getContractAt("MocMock", await mocIntegration.moc())) as MocMock;

        const erc20Factory = await ethers.getContractFactory("MockERC20");
        bAssetZusd = (await erc20Factory.deploy(
            "Zero USD Token",
            "ZUSD",
            18,
            accounts[0].address,
            ethers.utils.parseEther("100000000")
        )) as MockERC20;

        await basketManager.addBassets(
            [bAssetZusd.address, bAssetDoc.address],
            [1, 1],
            [0, 0],
            [1000, 1000],
            [false, false]
        );
    });

    describe("deployment", async () => {
        it("initial mocVendorAccount address should be null", async () => {
            expect(await mocIntegration.mocVendorAccount()).equal(ethers.constants.AddressZero);
        });

        it("only owner can set mocVendorAccount", async () => {
            await expect(
                mocIntegration.connect(alice).setMocVendorAccount(accounts[2].address)
            ).to.be.revertedWith("Ownable: caller is not the owner");

            await mocIntegration.connect(accounts[0]).setMocVendorAccount(accounts[2].address);
            expect(await mocIntegration.mocVendorAccount()).equal(accounts[2].address);

            await mocIntegration
                .connect(accounts[0])
                .setMocVendorAccount(ethers.constants.AddressZero);
            expect(await mocIntegration.mocVendorAccount()).equal(ethers.constants.AddressZero);
        });

        context("getDocFromDllrAndRedeemRBTC", async() => {
          it("should redeem from DLLR Money on Chain DoC and then redeem RBTC from DoC, all in one transaction", async () => {
            const dllrAmount = ethers.utils.parseEther("500").toString();

            // alice gets DLLR by minting it for
            // fund alice with 500 DoC
            await bAssetDoc.connect(alice).giveMe(dllrAmount);
            await bAssetDoc.connect(alice).approve(massetManager.address, dllrAmount);

            // await massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount);

            // mint DLLR to alice & check balances updates
            await expect(massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount))
                .to.changeTokenBalance(dllr, alice.address, dllrAmount)
                .to.changeTokenBalance(bAssetDoc, alice.address, `-${dllrAmount}`);

            // alice permits MocIntegration contract to approve dllrAmount for calling transferFrom(...) func
            const permit = await signERC2612Permit(
                alice,
                dllr.address.toLowerCase(),
                alice.address.toLowerCase(),
                mocIntegration.address.toLowerCase(),
                dllrAmount
            );

            // prerequisites:
            // calc expected RBTC for alice to receive
            const expectedRbtcValue = await moc.getRbtcValue(dllrAmount);

            // fund Money On Chain MoC contract with RBTC
            await setBalance(moc.address, expectedRbtcValue.mul(2));

            // alice calls MocIntegrationgetDocFromDllrAndRedeemRBTC(...)
            // to transfer DLLR dllrAmount to MoC contract and redeem RBTC
            // mocIntegration contract gets DLLR by permission from alice and calls
            // MocMock (MoC mock contract) redeem func to exchange DLLR to RBTC

            // await mocIntegration.connect(alice).getDocFromDllrAndRedeemRBTC(dllrAmount, permit);

            await expect(
                mocIntegration.connect(alice).getDocFromDllrAndRedeemRBTC(dllrAmount, permit)
            )
                .to.changeEtherBalances(
                    [alice.address, moc.address],
                    [expectedRbtcValue, `-${expectedRbtcValue}`]
                )
                .to.changeTokenBalance(dllr, alice.address, `-${dllrAmount}`);

            expect((await dllr.balanceOf(alice.address)).toString()).eq("0");
            expect(await ethers.provider.getBalance(moc.address)).eq(expectedRbtcValue);
          });
        })

        context("getDocFromDllrAndRedeemRbtcWithPermit2", async() => {
          it("should redeem from DLLR Money on Chain DoC and then redeem RBTC from DoC through Permit2, all in one transaction", async () => {
            const dllrAmount = ethers.utils.parseEther("500").toString();

            // alice gets DLLR by minting it for
            // fund alice with 500 DoC
            await bAssetDoc.connect(alice).giveMe(dllrAmount);
            await bAssetDoc.connect(alice).approve(massetManager.address, dllrAmount);

            // await massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount);

            // mint DLLR to alice & check balances updates
            await expect(massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount))
                .to.changeTokenBalance(dllr, alice.address, dllrAmount)
                .to.changeTokenBalance(bAssetDoc, alice.address, `-${dllrAmount}`);


            await dllr.connect(alice).approve(permit2.address, ethers.constants.MaxUint256);

            const nonce = generateNonce();
            const deadline = toDeadline(1000 * 60 * 60 * 30 /** 30 minutes */);

            const permitTransferFrom: PermitTransferFrom = {
                permitted: {
                    token: dllr.address,
                    amount: dllrAmount,
                },
                spender: mocIntegration.address.toLowerCase(),
                nonce: nonce.toNumber(),
                deadline: deadline
            }
            const network = await ethers.provider.getNetwork();
            const chainId = network.chainId;

            const { domain, types, values } = SignatureTransfer.getPermitData(permitTransferFrom, permit2.address, chainId);

            const signature = await alice._signTypedData(domain, types, values);

            // prerequisites:
            // calc expected RBTC for alice to receive
            const expectedRbtcValue = await moc.getRbtcValue(dllrAmount);

            // fund Money On Chain MoC contract with RBTC
            await setBalance(moc.address, expectedRbtcValue.mul(2));

            // alice calls MocIntegrationgetDocFromDllrAndRedeemRBTCWithPermit2(...)
            // to transfer DLLR dllrAmount to MoC contract and redeem RBTC
            // mocIntegration contract gets DLLR by permission from alice and calls
            // MocMock (MoC mock contract) redeem func to exchange DLLR to RBTC

            // await mocIntegration.connect(alice).getDocFromDllrAndRedeemRbtcWithPermit2(dllrAmount, permit);

            expect(await isUsedNonce(permit2, alice.address, nonce)).to.equal(false);
            await expect(
                mocIntegration.connect(alice).getDocFromDllrAndRedeemRbtcWithPermit2(permitTransferFrom, signature)
            )
                .to.changeEtherBalances(
                    [alice.address, moc.address],
                    [expectedRbtcValue, `-${expectedRbtcValue}`]
                )
                .to.changeTokenBalance(dllr, alice.address, `-${dllrAmount}`);

            expect((await dllr.balanceOf(alice.address)).toString()).eq("0");
            expect(await ethers.provider.getBalance(moc.address)).eq(expectedRbtcValue);
            
            expect(await isUsedNonce(permit2, alice.address, nonce)).to.equal(true);
          });

          it("should be able to redeem from DLLR Money on Chain DoC and then redeem RBTC from DoC through Permit2, with two transactions", async () => {
              const dllrAmount = ethers.utils.parseEther("500").toString();

              // alice gets DLLR by minting it for
              // fund alice with 500 DoC
              await bAssetDoc.connect(alice).giveMe(dllrAmount);
              await bAssetDoc.connect(alice).approve(massetManager.address, dllrAmount);

              // await massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount);

              // mint DLLR to alice & check balances updates
              await expect(massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount))
                  .to.changeTokenBalance(dllr, alice.address, dllrAmount)
                  .to.changeTokenBalance(bAssetDoc, alice.address, `-${dllrAmount}`);


              await dllr.connect(alice).approve(permit2.address, ethers.constants.MaxUint256);

              const nonce = generateNonce();
              expect(await isUsedNonce(permit2, alice.address, nonce)).to.equal(false);
              const deadline = toDeadline(1000 * 60 * 60 * 30 /** 30 minutes */);
              let dllrAmountToRedeem = new BN(dllrAmount).div(new BN(2)).toString();

              const permitTransferFrom: PermitTransferFrom = {
                  permitted: {
                      token: dllr.address,
                      amount: dllrAmountToRedeem,
                  },
                  spender: mocIntegration.address.toLowerCase(),
                  nonce: nonce.toNumber(),
                  deadline: deadline
              }
              const network = await ethers.provider.getNetwork();
              const chainId = network.chainId;

              var { domain, types, values } = SignatureTransfer.getPermitData(permitTransferFrom, permit2.address, chainId);

              const signature = await alice._signTypedData(domain, types, values);

              // prerequisites:
              // calc expected RBTC for alice to receive
              const initialExpectedRbtcValue = await moc.getRbtcValue(dllrAmount);

              // prerequisites:
              // calc expected RBTC for alice to receive
              const expectedRbtcValue = await moc.getRbtcValue(dllrAmountToRedeem);

              // fund Money On Chain MoC contract with RBTC
              await setBalance(moc.address, initialExpectedRbtcValue.mul(2));

              // alice calls MocIntegrationgetDocFromDllrAndRedeemRBTCWithPermit2(...)
              // to transfer DLLR dllrAmount to MoC contract and redeem RBTC
              // mocIntegration contract gets DLLR by permission from alice and calls
              // MocMock (MoC mock contract) redeem func to exchange DLLR to RBTC

              // await mocIntegration.connect(alice).getDocFromDllrAndRedeemRbtcWithPermit2(dllrAmount, permit);

              await expect(
                  mocIntegration.connect(alice).getDocFromDllrAndRedeemRbtcWithPermit2(permitTransferFrom, signature)
              )
                  .to.changeEtherBalances(
                      [alice.address, moc.address],
                      [expectedRbtcValue, `-${expectedRbtcValue}`]
                  )
                  .to.changeTokenBalance(dllr, alice.address, `-${dllrAmountToRedeem}`);

              expect(await isUsedNonce(permit2, alice.address, nonce)).to.equal(true);
              const nonce2 = generateNonce();
              expect(await isUsedNonce(permit2, alice.address, nonce2)).to.equal(false);
              const deadline2 = toDeadline(1000 * 60 * 60 * 30 /** 30 minutes */);

              const permitTransferFrom2: PermitTransferFrom = {
                  permitted: {
                      token: dllr.address,
                      amount: dllrAmountToRedeem,
                  },
                  spender: mocIntegration.address.toLowerCase(),
                  nonce: nonce2.toNumber(),
                  deadline: deadline2
              }

              var { domain, types, values } = SignatureTransfer.getPermitData(permitTransferFrom2, permit2.address, chainId);

              const signature2 = await alice._signTypedData(domain, types, values);

              var {v, r, s} = extractSignature(signature2);

              await expect(
                  mocIntegration.connect(alice).getDocFromDllrAndRedeemRbtcWithPermit2(permitTransferFrom2, signature2)
              )
                  .to.changeEtherBalances(
                      [alice.address, moc.address],
                      [expectedRbtcValue, `-${expectedRbtcValue}`]
                  )
                  .to.changeTokenBalance(dllr, alice.address, `-${dllrAmountToRedeem}`);

              expect((await dllr.balanceOf(alice.address)).toString()).eq("0");
              expect(await ethers.provider.getBalance(moc.address)).eq(initialExpectedRbtcValue);
              expect(await isUsedNonce(permit2, alice.address, nonce2)).to.equal(true);
          });

          it("should revert to redeem from DLLR Money on Chain DoC and then redeem RBTC from DoC if yet approved the permit2", async () => {
              const dllrAmount = ethers.utils.parseEther("500").toString();

              // alice gets DLLR by minting it for
              // fund alice with 500 DoC
              await bAssetDoc.connect(alice).giveMe(dllrAmount);
              await bAssetDoc.connect(alice).approve(massetManager.address, dllrAmount);

              // await massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount);

              // mint DLLR to alice & check balances updates
              await expect(massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount))
                  .to.changeTokenBalance(dllr, alice.address, dllrAmount)
                  .to.changeTokenBalance(bAssetDoc, alice.address, `-${dllrAmount}`);

              const nonce = generateNonce();
              expect(await isUsedNonce(permit2, alice.address, nonce)).to.equal(false);
              const deadline = toDeadline(1000 * 60 * 60 * 30 /** 30 minutes */);

              const permitTransferFrom: PermitTransferFrom = {
                  permitted: {
                      token: dllr.address,
                      amount: dllrAmount,
                  },
                  spender: mocIntegration.address.toLowerCase(),
                  nonce: nonce.toNumber(),
                  deadline: deadline
              }
              const network = await ethers.provider.getNetwork();
              const chainId = network.chainId;

              const { domain, types, values } = SignatureTransfer.getPermitData(permitTransferFrom, permit2.address, chainId);

              const signature = await alice._signTypedData(domain, types, values);

              // prerequisites:
              // calc expected RBTC for alice to receive
              const expectedRbtcValue = await moc.getRbtcValue(dllrAmount);

              // fund Money On Chain MoC contract with RBTC
              await setBalance(moc.address, expectedRbtcValue.mul(2));

              // alice calls MocIntegrationgetDocFromDllrAndRedeemRBTCWithPermit2(...)
              // to transfer DLLR dllrAmount to MoC contract and redeem RBTC
              // mocIntegration contract gets DLLR by permission from alice and calls
              // MocMock (MoC mock contract) redeem func to exchange DLLR to RBTC

              // await mocIntegration.connect(alice).getDocFromDllrAndRedeemRbtcWithPermit2(dllrAmount, permit);

              await expect(
                  mocIntegration.connect(alice).getDocFromDllrAndRedeemRbtcWithPermit2(permitTransferFrom, signature)
              ).to.be.revertedWith("TRANSFER_FROM_FAILED");
              expect(await isUsedNonce(permit2, alice.address, nonce)).to.equal(false);
          });

          it("should revert to redeem from DLLR Money on Chain DoC and then redeem RBTC from DoC if signature is assigned to wrong spender", async () => {
              const dllrAmount = ethers.utils.parseEther("500").toString();

              // alice gets DLLR by minting it for
              // fund alice with 500 DoC
              await bAssetDoc.connect(alice).giveMe(dllrAmount);
              await bAssetDoc.connect(alice).approve(massetManager.address, dllrAmount);

              // await massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount);

              // mint DLLR to alice & check balances updates
              await expect(massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount))
                  .to.changeTokenBalance(dllr, alice.address, dllrAmount)
                  .to.changeTokenBalance(bAssetDoc, alice.address, `-${dllrAmount}`);

              await dllr.connect(alice).approve(permit2.address, ethers.constants.MaxUint256);

              const nonce = generateNonce();
              expect(await isUsedNonce(permit2, alice.address, nonce)).to.equal(false);
              const deadline = toDeadline(1000 * 60 * 60 * 30 /** 30 minutes */);

              const permitTransferFrom: PermitTransferFrom = {
                  permitted: {
                      token: dllr.address,
                      amount: dllrAmount,
                  },
                  spender: alice.address, // wrong spender contract here
                  nonce: nonce.toNumber(),
                  deadline: deadline
              }
              const network = await ethers.provider.getNetwork();
              const chainId = network.chainId;

              const { domain, types, values } = SignatureTransfer.getPermitData(permitTransferFrom, permit2.address, chainId);

              const signature = await alice._signTypedData(domain, types, values);

              // prerequisites:
              // calc expected RBTC for alice to receive
              const expectedRbtcValue = await moc.getRbtcValue(dllrAmount);

              // fund Money On Chain MoC contract with RBTC
              await setBalance(moc.address, expectedRbtcValue.mul(2));

              // alice calls MocIntegrationgetDocFromDllrAndRedeemRBTCWithPermit2(...)
              // to transfer DLLR dllrAmount to MoC contract and redeem RBTC
              // mocIntegration contract gets DLLR by permission from alice and calls
              // MocMock (MoC mock contract) redeem func to exchange DLLR to RBTC

              // await mocIntegration.connect(alice).getDocFromDllrAndRedeemRbtcWithPermit2(dllrAmount, permit);

              await expect(
                  mocIntegration.connect(alice).getDocFromDllrAndRedeemRbtcWithPermit2(permitTransferFrom, signature)
              ).to.revertedWithCustomError(permit2, "InvalidSigner");
              expect(await isUsedNonce(permit2, alice.address, nonce)).to.equal(false);
          });

          it("should revert to redeem from DLLR Money on Chain DoC and then redeem RBTC from DoC through Permit2, with two transactions with invalid nonce", async () => {
              const dllrAmount = ethers.utils.parseEther("500").toString();

              // alice gets DLLR by minting it for
              // fund alice with 500 DoC
              await bAssetDoc.connect(alice).giveMe(dllrAmount);
              await bAssetDoc.connect(alice).approve(massetManager.address, dllrAmount);

              // await massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount);

              // mint DLLR to alice & check balances updates
              await expect(massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount))
                  .to.changeTokenBalance(dllr, alice.address, dllrAmount)
                  .to.changeTokenBalance(bAssetDoc, alice.address, `-${dllrAmount}`);


              await dllr.connect(alice).approve(permit2.address, ethers.constants.MaxUint256);

              const nonce = generateNonce();
              expect(await isUsedNonce(permit2, alice.address, nonce)).to.equal(false);
              const deadline = toDeadline(1000 * 60 * 60 * 30 /** 30 minutes */);
              let dllrAmountToRedeem = new BN(dllrAmount).div(new BN(2)).toString();

              const permitTransferFrom: PermitTransferFrom = {
                  permitted: {
                      token: dllr.address,
                      amount: dllrAmountToRedeem,
                  },
                  spender: mocIntegration.address.toLowerCase(),
                  nonce: nonce.toNumber(),
                  deadline: deadline
              }
              const network = await ethers.provider.getNetwork();
              const chainId = network.chainId;

              var { domain, types, values } = SignatureTransfer.getPermitData(permitTransferFrom, permit2.address, chainId);

              const signature = await alice._signTypedData(domain, types, values);

              // prerequisites:
              // calc expected RBTC for alice to receive
              const initialExpectedRbtcValue = await moc.getRbtcValue(dllrAmount);

              // prerequisites:
              // calc expected RBTC for alice to receive
              const expectedRbtcValue = await moc.getRbtcValue(dllrAmountToRedeem);

              // fund Money On Chain MoC contract with RBTC
              await setBalance(moc.address, initialExpectedRbtcValue.mul(2));

              // alice calls MocIntegrationgetDocFromDllrAndRedeemRBTCWithPermit2(...)
              // to transfer DLLR dllrAmount to MoC contract and redeem RBTC
              // mocIntegration contract gets DLLR by permission from alice and calls
              // MocMock (MoC mock contract) redeem func to exchange DLLR to RBTC

              // await mocIntegration.connect(alice).getDocFromDllrAndRedeemRbtcWithPermit2(dllrAmount, permit);

              await expect(
                  mocIntegration.connect(alice).getDocFromDllrAndRedeemRbtcWithPermit2(permitTransferFrom, signature)
              )
                  .to.changeEtherBalances(
                      [alice.address, moc.address],
                      [expectedRbtcValue, `-${expectedRbtcValue}`]
                  )
                  .to.changeTokenBalance(dllr, alice.address, `-${dllrAmountToRedeem}`);

              expect(await isUsedNonce(permit2, alice.address, nonce)).to.equal(true);
              const deadline2 = toDeadline(1000 * 60 * 60 * 30 /** 30 minutes */);

              const permitTransferFrom2: PermitTransferFrom = {
                  permitted: {
                      token: dllr.address,
                      amount: dllrAmountToRedeem,
                  },
                  spender: mocIntegration.address.toLowerCase(),
                  nonce: nonce.toNumber(),
                  deadline: deadline2
              }

              var { domain, types, values } = SignatureTransfer.getPermitData(permitTransferFrom2, permit2.address, chainId);

              const signature2 = await alice._signTypedData(domain, types, values);

              await expect(
                  mocIntegration.connect(alice).getDocFromDllrAndRedeemRbtcWithPermit2(permitTransferFrom2, signature2)
              ).to.revertedWithCustomError(permit2, "InvalidNonce");
                  
          });

          it("should revert if signature is being used by non-authorized spender", async () => {
              const attacker = accounts[5];
              const dllrAmount = ethers.utils.parseEther("500").toString();

              // alice gets DLLR by minting it for
              // fund alice with 500 DoC
              await bAssetDoc.connect(alice).giveMe(dllrAmount);
              await bAssetDoc.connect(alice).approve(massetManager.address, dllrAmount);

              // await massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount);

              // mint DLLR to alice & check balances updates
              await expect(massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount))
                  .to.changeTokenBalance(dllr, alice.address, dllrAmount)
                  .to.changeTokenBalance(bAssetDoc, alice.address, `-${dllrAmount}`);

              await dllr.connect(alice).approve(permit2.address, ethers.constants.MaxUint256);

              const nonce = generateNonce();
              expect(await isUsedNonce(permit2, alice.address, nonce)).to.equal(false);
              const deadline = toDeadline(1000 * 60 * 60 * 30 /** 30 minutes */);

              const permitTransferFrom: PermitTransferFrom = {
                  permitted: {
                      token: dllr.address,
                      amount: dllrAmount,
                  },
                  spender: mocIntegration.address.toLowerCase(),
                  nonce: nonce.toNumber(),
                  deadline: deadline
              }

              const transferDetails: {
                  to: string;
                  requestedAmount: string;
              } = {
                  to: attacker.address,
                  requestedAmount: dllrAmount
              }
              const network = await ethers.provider.getNetwork();
              const chainId = network.chainId;

              const { domain, types, values } = SignatureTransfer.getPermitData(permitTransferFrom, permit2.address, chainId);

              const signature = await alice._signTypedData(domain, types, values);

              const {v, r, s} = extractSignature(signature);
              
              await expect(dllr.connect(attacker).transferWithPermit(alice.address, attacker.address, dllrAmount, deadline, v, r, s)).to.revertedWith("ERC20Permit: invalid signature");
              await expect(permit2["permitTransferFrom(((address,uint256),uint256,uint256),(address,uint256),address,bytes)"](permitTransferFrom, transferDetails, alice.address, signature)).to.revertedWithCustomError(permit2, "InvalidSigner");
              expect(await isUsedNonce(permit2, alice.address, nonce)).to.equal(false);
          });
        })
    });
});
