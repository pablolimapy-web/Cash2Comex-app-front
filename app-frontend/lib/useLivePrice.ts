'use client';

import useSWR from 'swr';
import { COINGECKO_ID_BY_SYMBOL } from '@/app/buy/data/priceMap';

type PricesResp = Record<string, { brl: number }>;

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/** Retorna { priceBRLBySymbol, isLoading, error } */
export function useLivePriceBRL(symbols: string[]) {
    // traduz símbolos -> ids válidos
    const ids = symbols
        .map((s) => COINGECKO_ID_BY_SYMBOL[s.toUpperCase()])
        .filter(Boolean);

    const key = ids.length ? `/api/prices?ids=${ids.join(',')}&vs=brl` : null;
    const { data, error, isLoading } = useSWR<PricesResp>(key, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 30_000,
    });

    // monta um dicionário por símbolo original
    const priceBRLBySymbol: Record<string, number> = {};
    if (data) {
        symbols.forEach((sym) => {
            const id = COINGECKO_ID_BY_SYMBOL[sym.toUpperCase()];
            const v = id ? data[id]?.brl : undefined;
            if (typeof v === 'number') priceBRLBySymbol[sym.toUpperCase()] = v;
        });
    }

    return { priceBRLBySymbol, isLoading, error };
}
