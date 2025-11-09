// app/buy/data/all-tokens.ts
export type TokenInfo = {
    symbol: string;
    name: string;
    icon: string;
    chains: number[];
    priority?: number;
};

export const ALL_TOKENS: TokenInfo[] = [
    { symbol: 'ETH', name: 'Ether', icon: '/assets/icons/tokens/eth.svg',
        chains: [1, 42161, 8453, 137, 10, 43114, 56] },

    // Estáveis
    { symbol: 'USDT', name: 'Tether', icon: '/assets/icons/tokens/usdt.svg',
        chains: [1, 42161, 8453, 137, 10, 43114, 56], priority: 1 },
    { symbol: 'USDC', name: 'USD Coin', icon: '/assets/icons/tokens/usdc.svg',
        chains: [1, 42161, 8453, 137, 10, 43114, 56], priority: 1 },

    // Arbitrum
    { symbol: 'ARB', name: 'Arbitrum', icon: '/assets/icons/tokens/arb.svg',
        chains: [42161] },
    { symbol: 'GMX', name: 'GMX', icon: '/assets/icons/tokens/gmx.svg',
        chains: [42161] },

    { symbol: 'GRT', name: 'The Graph', icon: '/assets/icons/tokens/grt.svg',
        chains: [1, 42161, 137, 10] },
    { symbol: 'LINK', name: 'Chainlink', icon: '/assets/icons/tokens/link.svg',
        chains: [1, 42161, 8453, 137, 10, 43114, 56] },
    { symbol: 'LDO', name: 'Lido DAO', icon: '/assets/icons/tokens/ldo.svg',
        chains: [1, 42161, 137, 10] },
    { symbol: 'PENDLE', name: 'Pendle', icon: '/assets/icons/tokens/pendle.svg',
        chains: [1, 42161, 137] },
    { symbol: 'WBTC', name: 'Wrapped BTC', icon: '/assets/icons/tokens/wbtc.svg',
        chains: [1, 42161, 137, 10] },

    { symbol: 'PEPE', name: 'PEPE', icon: '/assets/icons/tokens/pepe.svg',
        chains: [42161, 1] },
];

