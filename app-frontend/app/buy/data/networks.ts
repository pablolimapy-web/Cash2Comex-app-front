// data/networks.ts
import type { EvmChain } from '@/utils/eth';

export type NetworkInfo = {
    id: string;
    name: string;
    icon: string;
    evm: boolean;
    tag?: string;
    chain?: EvmChain;
};

export const NETWORKS: NetworkInfo[] = [
    {
        id: 'ethereum',
        name: 'Ethereum',
        icon: '/assets/icons/networks/ethereum.svg',
        evm: true,
        chain: {
            chainId: 1,
            hex: '0x1',
            chainName: 'Ethereum Mainnet',
            rpcUrls: ['https://rpc.ankr.com/eth'],
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            blockExplorerUrls: ['https://etherscan.io'],
        },
    },
    { id: 'bitcoin',  name: 'Bitcoin',   icon: '/assets/icons/networks/bitcoin.svg',   evm: false },
    { id: 'hyperEVM', name: 'HyperEVM',  icon: '/assets/icons/networks/hyperevm.svg',  evm: true,  tag: 'Novo' },
    { id: 'solana',   name: 'Solana',    icon: '/assets/icons/networks/solana.svg',    evm: false },
    { id: 'tron',     name: 'Tron',      icon: '/assets/icons/networks/tron.svg',      evm: false },

    {
        id: 'arbitrum',
        name: 'Arbitrum',
        icon: '/assets/icons/networks/arbitrum.svg',
        evm: true,
        chain: {
            chainId: 42161,
            hex: '0xa4b1',
            chainName: 'Arbitrum One',
            rpcUrls: ['https://arb1.arbitrum.io/rpc'],
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            blockExplorerUrls: ['https://arbiscan.io'],
        },
    },
    {
        id: 'base',
        name: 'Base',
        icon: '/assets/icons/networks/base.svg',
        evm: true,
        chain: {
            chainId: 8453, hex: '0x2105', chainName: 'Base Mainnet',
            rpcUrls: ['https://mainnet.base.org'],
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            blockExplorerUrls: ['https://basescan.org'],
        },
    },
    {
        id: 'polygon',
        name: 'Polygon',
        icon: '/assets/icons/networks/polygon.svg',
        evm: true,
        chain: {
            chainId: 137, hex: '0x89', chainName: 'Polygon Mainnet',
            rpcUrls: ['https://polygon-rpc.com'],
            nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
            blockExplorerUrls: ['https://polygonscan.com'],
        },
    },
    {
        id: 'bsc',
        name: 'BSC',
        icon: '/assets/icons/networks/bsc.svg',
        evm: true,
        chain: {
            chainId: 56, hex: '0x38', chainName: 'BNB Smart Chain',
            rpcUrls: ['https://bsc-dataseed.binance.org'],
            nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
            blockExplorerUrls: ['https://bscscan.com'],
        },
    },
    {
        id: 'avalanche',
        name: 'Avalanche',
        icon: '/assets/icons/networks/avalanche.svg',
        evm: true,
        chain: {
            chainId: 43114, hex: '0xa86a', chainName: 'Avalanche C-Chain',
            rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
            nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
            blockExplorerUrls: ['https://snowtrace.io'],
        },
    },
    {
        id: 'optimism',
        name: 'Optimism',
        icon: '/assets/icons/networks/optimism.svg',
        evm: true,
        chain: {
            chainId: 10, hex: '0xa', chainName: 'Optimism',
            rpcUrls: ['https://mainnet.optimism.io'],
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            blockExplorerUrls: ['https://optimistic.etherscan.io'],
        },
    },
];
