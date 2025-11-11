// lib/useQuote.ts
import { useEffect, useMemo, useState } from 'react';

type In = {
    side: 'buy' | 'sell';
    crypto: string;            // símbolo: 'BTC', 'ETH', 'USDT'...
    fiat: 'BRL';
    amountFiat?: number;       // usado no 'buy'
    amountCrypto?: number;     // usado no 'sell'
    feePct?: number;           // taxa total (ex.: 0.03)
    networkId?: string;        // 'arbitrum' | 'base' | 'polygon' | 'bsc' | 'avalanche' | 'optimism' | 'solana' | 'tron' | ...
    coingeckoId?: string;      // opcional: id direto do CoinGecko
};

/** -----------------------------
 *  Tabela genérica por símbolo
 *  ----------------------------- */
const ID_MAP: Record<string, string> = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    USDT: 'tether',
    USDC: 'usd-coin',
    DAI: 'dai',
    BNB: 'binancecoin',
    MATIC: 'matic-network',
    ARB: 'arbitrum',
    OP: 'optimism',
    AVAX: 'avalanche-2',
    SOL: 'solana',
    TRX: 'tron',
};

/** ------------------------------------------
 *  Tabela específica por rede + símbolo
 *  ------------------------------------------ */
const SYMBOL_NETWORK_MAP: Record<string, Record<string, string>> = {
    base:       { ETH: 'ethereum', USDC: 'usd-coin', USDT: 'tether' },
    arbitrum:   { ETH: 'ethereum', ARB: 'arbitrum', USDT: 'tether', USDC: 'usd-coin', DAI: 'dai' },
    optimism:   { ETH: 'ethereum', OP: 'optimism', USDT: 'tether', USDC: 'usd-coin', DAI: 'dai' },
    polygon:    { MATIC: 'matic-network', USDT: 'tether', USDC: 'usd-coin', DAI: 'dai', ETH: 'ethereum' },
    bsc:        { BNB: 'binancecoin', USDT: 'tether', USDC: 'usd-coin' },
    avalanche:  { AVAX: 'avalanche-2', USDT: 'tether', USDC: 'usd-coin' },
    solana:     { SOL: 'solana', USDC: 'usd-coin', USDT: 'tether' },
    tron:       { TRX: 'tron', USDT: 'tether', USDC: 'usd-coin' },
    hyperevm:   { ETH: 'ethereum', USDT: 'tether', USDC: 'usd-coin' }, // fallback
};

/** -----------------------------
 *  Fallback em BRL (se API falhar)
 *  ----------------------------- */
const FALLBACK_BRL_RATE: Record<string, number> = {
    BTC: 350000,
    ETH: 17000,
    USDT: 5,
    USDC: 5,
    DAI: 5,
    BNB: 3000,
    MATIC: 3.5,
    ARB: 4.5,
    OP: 10,
    AVAX: 200,
    SOL: 700,
    TRX: 0.6,
};

function resolveGeckoId(symbol: string, networkId?: string, explicitId?: string) {
    if (explicitId) return explicitId;
    const sym = symbol.toUpperCase();
    const net = (networkId || '').toLowerCase();

    const netMap = SYMBOL_NETWORK_MAP[net];
    if (netMap && netMap[sym]) return netMap[sym];
    if (ID_MAP[sym]) return ID_MAP[sym];
    return null;
}

export function useQuote({
                             side,
                             crypto,
                             fiat, // mantido por semântica, hoje fixo 'BRL'
                             amountFiat = 0,
                             amountCrypto = 0,
                             feePct = 0,
                             networkId,
                             coingeckoId,
                         }: In) {
    const [rate, setRate] = useState<number>(FALLBACK_BRL_RATE[crypto.toUpperCase()] ?? 0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const id = resolveGeckoId(crypto, networkId, coingeckoId);

        if (!id) {
            const fb = FALLBACK_BRL_RATE[crypto.toUpperCase()] ?? 0;
            setRate(fb);
            setError(`Token não mapeado (${crypto}); usando fallback`);
            return;
        }

        const fetchRate = async () => {
            try {
                setLoading(true); setError(null);
                const r = await fetch(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=brl`,
                    { cache: 'no-store' }
                );
                const data = await r.json();
                const brl = Number(data?.[id]?.brl);
                if (mounted && isFinite(brl) && brl > 0) {
                    setRate(brl);
                } else if (mounted) {
                    setError('Cotação inválida (fallback)');
                    setRate(FALLBACK_BRL_RATE[crypto.toUpperCase()] ?? 0);
                }
            } catch {
                if (mounted) {
                    setError('Falha ao obter cotação (fallback)');
                    setRate(FALLBACK_BRL_RATE[crypto.toUpperCase()] ?? 0);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchRate();
        const t = setInterval(fetchRate, 30000);
        return () => { mounted = false; clearInterval(t); };
    }, [crypto, networkId, coingeckoId]);

    const out = useMemo(() => {
        const pct = Math.max(feePct, 0);
        if (!rate || !isFinite(rate)) return { rate: 0, outCrypto: 0, outFiat: 0, loading, error };

        if (side === 'buy') {
            const gross = rate ? (amountFiat ?? 0) / rate : 0;
            const net = gross * (1 - pct);
            return { rate, outCrypto: net, outFiat: undefined, loading, error };
        }
        const gross = (amountCrypto ?? 0) * rate;
        const net = gross * (1 - pct);
        return { rate, outCrypto: undefined, outFiat: net, loading, error };
        // feePct incluso nas dependências para reagir ao cupom
    }, [side, amountFiat, amountCrypto, rate, feePct, loading, error]);

    return out;
}
