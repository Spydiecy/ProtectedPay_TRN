// utils./constants.ts
import { assetIdToERC20Address } from "@therootnetwork/evm";

const ROOT_ASSET_ID = 1;
const ROOT_CONTRACT_ADDRESS = assetIdToERC20Address(ROOT_ASSET_ID);

export const STATUS_LABELS = {
    0: 'Pending',
    1: 'Completed',
    2: 'Cancelled'
  } as const;
  
  export const STATUS_COLORS = {
    0: 'bg-yellow-500/20 text-yellow-500',
    1: 'bg-green-500/20 text-green-500',
    2: 'bg-red-500/20 text-red-500'
  } as const;
  
  export const POT_STATUS_LABELS = {
    0: 'Active',
    1: 'Broken'
  } as const;
  
  export const POT_STATUS_COLORS = {
    0: 'bg-green-500/20 text-green-500',
    1: 'bg-gray-500/20 text-gray-500'
  } as const;
  
  export const ANIMATION_DURATION = 0.5;
  export const STAGGER_DELAY = 0.1;
  export const MIN_PARTICIPANTS = 2;

// Supported ERC20 tokens for transfers
export const SUPPORTED_TOKENS = [
  {
    address: 'NATIVE',
    symbol: 'XRP',
    name: 'XRP (Native)',
    decimals: 18,
    logo: '/chains/trn.png', // Using TRN logo for native token
    isNative: true
  },
  {
    address: ROOT_CONTRACT_ADDRESS,
    symbol: 'ROOT',
    name: 'Root Token',
    decimals: 6,
    logo: '/chains/trn.png', // Will be updated with ROOT logo
    isNative: false
  },
  {
    address: '0xCCcCCcCC00000C64000000000000000000000000',
    symbol: 'STYLO',
    name: 'Stylo Token',
    decimals: 18,
    logo: '/chains/trn.png', // Placeholder, will be updated
    isNative: false
  },
  {
    address: '0xcCcCCccC00004464000000000000000000000000',
    symbol: 'ASTO',
    name: 'Asto Token',
    decimals: 18,
    logo: '/chains/trn.png', // Placeholder, will be updated
    isNative: false
  }
] as const;

export type Token = typeof SUPPORTED_TOKENS[number];