// app/buy/hooks/useTokenCatalog.ts
import { useMemo } from 'react';
import { ALL_TOKENS, TokenInfo } from '../data/all-tokens';

export function useTokensByChain(chainId?: number) {
    return useMemo<TokenInfo[]>(() => {
        if (!chainId) return [];
        return ALL_TOKENS
            .filter(t => t.chains.includes(chainId))
            .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0) || a.symbol.localeCompare(b.symbol));
    }, [chainId]);
}

export function ensureTokenOnChain(symbol: string, chainId?: number): string {
    if (!chainId) return symbol;
    const token = ALL_TOKENS.find(t => t.symbol === symbol);
    if (token && token.chains.includes(chainId)) return symbol;

    // fallback: ETH se existir na rede, senão primeiro da lista dessa rede
    const eth = ALL_TOKENS.find(t => t.symbol === 'ETH' && t.chains.includes(chainId));
    if (eth) return 'ETH';

    const first = ALL_TOKENS.find(t => t.chains.includes(chainId));
    return first ? first.symbol : symbol;
}
