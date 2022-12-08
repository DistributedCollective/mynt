import {
  BasketManagerV3Instance,
  MetaAssetTokenContract,
} from "types/generated";

const Token = artifacts.require("MetaAssetToken");
const BasketManagerV3 = artifacts.require("BasketManagerV3");

export const createToken = async (massetAddress: string) => {
  const token: MetaAssetTokenContract = await Token.new("Mock1", "MK1");
  token.transferOwnership(massetAddress);
  return token;
  // TODO: add MetaAssetToken MAsset and BasketManager proxies instantiations
};

export type CreateBasketV3Args = {
  massetAddress: string;
  txDetails?: Truffle.TransactionDetails;
};

export type UpgradeBasketToV4Args = Omit<CreateBasketV3Args, "massetAddress">;

export const RATIO_PRECISION = 1000;

export const createBasketManagerV3 = async (
  config: CreateBasketV3Args
): Promise<BasketManagerV3Instance> => {
  const { massetAddress, txDetails } = config;

  const basketManagerV3 = await BasketManagerV3.new(txDetails);
  await basketManagerV3.initialize(massetAddress);

  return basketManagerV3;
};
