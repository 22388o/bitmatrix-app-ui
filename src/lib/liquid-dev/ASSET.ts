import SWAP_ASSET from '../../enum/SWAP_ASSET';
import { PAsset } from '@bitmatrix/models';

export const lbtcAsset: PAsset = {
  assetHash: '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49',
  name: 'Liquid Bitcoin',
  precision: 8,
  ticker: SWAP_ASSET.LBTC,
};

export const usdtAsset: PAsset = {
  assetHash: 'f3d1ec678811398cd2ae277cbe3849c6f6dbd72c74bc542f7c4b11ff0e820958',
  name: 'Tether USD',
  precision: 8,
  ticker: SWAP_ASSET.USDT,
};
