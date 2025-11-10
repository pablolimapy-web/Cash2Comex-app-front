// app/buy/data/tokens.ts
export type TokenInfo = {
    symbol: string;
    name: string;
    icon?: string;
};

export type TokensByNetwork = Record<string, TokenInfo[]>;

export const TOKENS_BY_NETWORK: TokensByNetwork = {
    /* -------------------- Não-EVM -------------------- */
    bitcoin: [
        { symbol: "BTC", name: "Bitcoin", icon: "/assets/icons/tokens/btc.svg" },
    ],
    solana: [
        { symbol: "SOL", name: "Solana", icon: "/assets/icons/tokens/sol.svg" },
        { symbol: "USDC", name: "USD Coin (SPL)", icon: "/assets/icons/tokens/usdc.svg" },
        { symbol: "USDT", name: "Tether (SPL)", icon: "/assets/icons/tokens/usdt.svg" },
    ],
    tron: [
        { symbol: "TRX", name: "TRON", icon: "/assets/icons/tokens/trx.svg" },
        { symbol: "USDT", name: "Tether (TRC20)", icon: "/assets/icons/tokens/usdt.svg" },
        { symbol: "USDC", name: "USD Coin (TRC20)", icon: "/assets/icons/tokens/usdc.svg" },
    ],

    /* -------------------- EVMs -------------------- */
    arbitrum: [
        { symbol: "ETH", name: "Ethereum", icon: "/assets/icons/tokens/eth.svg" },
        { symbol: "USDT", name: "Tether (ERC20)", icon: "/assets/icons/tokens/usdt.svg" },
        { symbol: "USDC", name: "USD Coin (ERC20)", icon: "/assets/icons/tokens/usdc.svg" },
        { symbol: "ARB", name: "Arbitrum", icon: "/assets/icons/tokens/arb.svg" },
        { symbol: "GRT", name: "The Graph", icon: "/assets/icons/tokens/grt.svg" },
        { symbol: "LINK", name: "Chainlink", icon: "/assets/icons/tokens/link.svg" },
        { symbol: "PENDLE", name: "Pendle", icon: "/assets/icons/tokens/pendle.svg" },
        { symbol: "LDO", name: "Lido DAO", icon: "/assets/icons/tokens/ldo.svg" },
        { symbol: "GMX", name: "GMX", icon: "/assets/icons/tokens/gmx.svg" },
        { symbol: "PEPE", name: "Pepe", icon: "/assets/icons/tokens/pepe.svg" },
        { symbol: "WBTC", name: "Wrapped BTC", icon: "/assets/icons/tokens/wbtc.svg" },
    ],

    base: [
        { symbol: "ETH", name: "Ethereum", icon: "/assets/icons/tokens/eth.svg" },
        { symbol: "USDC", name: "USD Coin (Base)", icon: "/assets/icons/tokens/usdc.svg" },
        { symbol: "USDT", name: "Tether (Base)", icon: "/assets/icons/tokens/usdt.svg" },
    ],

    polygon: [
        { symbol: "MATIC", name: "Polygon", icon: "/assets/icons/tokens/matic.svg" },
        { symbol: "USDT", name: "Tether (ERC20)", icon: "/assets/icons/tokens/usdt.svg" },
        { symbol: "USDC", name: "USD Coin (ERC20)", icon: "/assets/icons/tokens/usdc.svg" },
        { symbol: "WETH", name: "Wrapped ETH", icon: "/assets/icons/tokens/weth.svg" },
    ],

    bsc: [
        { symbol: "BNB", name: "BNB", icon: "/assets/icons/tokens/bnb.svg" },
        { symbol: "USDT", name: "Tether (BEP20)", icon: "/assets/icons/tokens/usdt.svg" },
        { symbol: "USDC", name: "USD Coin (BEP20)", icon: "/assets/icons/tokens/usdc.svg" },
    ],

    avalanche: [
        { symbol: "AVAX", name: "Avalanche", icon: "/assets/icons/tokens/avax.svg" },
        { symbol: "USDT", name: "Tether (ERC20)", icon: "/assets/icons/tokens/usdt.svg" },
        { symbol: "USDC", name: "USD Coin (ERC20)", icon: "/assets/icons/tokens/usdc.svg" },
    ],

    optimism: [
        { symbol: "ETH", name: "Ethereum", icon: "/assets/icons/tokens/eth.svg" },
        { symbol: "USDT", name: "Tether (ERC20)", icon: "/assets/icons/tokens/usdt.svg" },
        { symbol: "USDC", name: "USD Coin (ERC20)", icon: "/assets/icons/tokens/usdc.svg" },
    ],

    ethereum: [
        { symbol: "ETH", name: "Ethereum", icon: "/assets/icons/tokens/eth.svg" },
        { symbol: "USDT", name: "Tether (ERC20)", icon: "/assets/icons/tokens/usdt.svg" },
        { symbol: "USDC", name: "USD Coin (ERC20)", icon: "/assets/icons/tokens/usdc.svg" },
        { symbol: "WBTC", name: "Wrapped BTC", icon: "/assets/icons/tokens/wbtc.svg" },
        { symbol: "DAI", name: "Dai", icon: "/assets/icons/tokens/dai.svg" },
    ],

    /* rede extra que você usa no modal */
    hyperEVM: [
        { symbol: "USDT", name: "Tether", icon: "/assets/icons/tokens/usdt.svg" },
        { symbol: "USDC", name: "USD Coin", icon: "/assets/icons/tokens/usdc.svg" },
        { symbol: "ETH", name: "Ethereum", icon: "/assets/icons/tokens/eth.svg" },
    ],
};
