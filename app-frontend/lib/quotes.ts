export type Side = 'buy' | 'sell';
export type Network = 'Arbitrum' | 'Ethereum' | 'Polygon' | 'Base' | 'BSC' | 'Optimism' | 'Avalanche';
export type Fiat = 'BRL';

export type Crypto =
    | 'ETH'
    | 'USDT'
    | 'USDC'
    | 'ARB'
    | 'GRT'
    | 'LINK'
    | 'PENDLE'
    | 'LDO'
    | 'GMX'
    | 'PEPE';

export type GetQuoteInput = {
    side: Side;
    network: Network | string;
    crypto: Crypto;
    fiat: Fiat;
    amountCrypto?: number;
    amountFiat?: number;
};

export type Quote = {
    rate: number;
    feePct: number;
    feeFixed: number;
    minFiat: number;
    maxFiat: number;
    outCrypto: number;
    outFiat: number;
};


const RATES: Record<Crypto, number> = {
    ETH:    18500,
    USDT:   5.65,
    USDC:   5.65,
    ARB:    8.90,
    GRT:    1.45,
    LINK:   90.0,
    PENDLE: 35.0,
    LDO:    12.5,
    GMX:    190.0,
    PEPE:   0.00005,
};

const DEFAULTS = {
    feePct: 0.008,
    feeFixed: 2.5,
    minFiat: 50,
    maxFiat: 50000,
};

// Helper seguro (evita NaN)
const num = (v: any) => (typeof v === 'number' && isFinite(v) ? v : 0);

export function getQuote(input: GetQuoteInput): Quote {
    const rate = RATES[input.crypto] ?? 1000; // fallback seguro
    const { feePct, feeFixed, minFiat, maxFiat } = DEFAULTS;

    let outCrypto = 0;
    let outFiat = 0;

    if (input.side === 'buy') {
        const fiat = Math.min(Math.max(num(input.amountFiat), 0), maxFiat);
        // compra: converte BRL -> Cripto
        const grossCrypto = fiat / rate;
        const feeCryptoPct = grossCrypto * feePct;
        const feeCryptoFixed = feeFixed / rate;
        outCrypto = Math.max(grossCrypto - feeCryptoPct - feeCryptoFixed, 0);
        outFiat = fiat;
    } else {
        const crypto = Math.max(num(input.amountCrypto), 0);
        const grossFiat = crypto * rate;
        const feeFiatPct = grossFiat * feePct;
        const feeFiatFixed = feeFixed;
        outFiat = Math.max(grossFiat - feeFiatPct - feeFiatFixed, 0);
        outCrypto = crypto;
    }

    return {
        rate,
        feePct,
        feeFixed,
        minFiat,
        maxFiat,
        outCrypto,
        outFiat,
    };
}
