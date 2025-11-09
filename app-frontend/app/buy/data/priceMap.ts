// app/buy/data/priceMap.ts
export const COINGECKO_ID_BY_SYMBOL: Record<string, string> = {
    // L1s / não-EVM
    BTC: 'bitcoin',
    SOL: 'solana',
    TRX: 'tron',

    // EVM nativos e blue chips
    ETH: 'ethereum',
    MATIC: 'matic-network',
    BNB: 'binancecoin',
    AVAX: 'avalanche-2',
    ARB: 'arbitrum',

    // estáveis
    USDT: 'tether',
    USDC: 'usd-coin',
    DAI: 'dai',

    // outros que você usa
    WBTC: 'wrapped-bitcoin',
    WETH: 'weth',
    LINK: 'chainlink',
    GRT: 'the-graph',
    LDO: 'lido-dao',
    GMX: 'gmx',
    PENDLE: 'pendle',
    PEPE: 'pepe',
};
