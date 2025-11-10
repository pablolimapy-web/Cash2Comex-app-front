'use client';

import TokenLogo from './TokenLogo';

type Token = { code: 'ETH' | 'USDT'; name: string; note?: string };

const TOKENS: Token[] = [
    { code: 'ETH', name: 'Ethereum', note: 'Mais usado' },
    { code: 'USDT', name: 'Tether' },
];

export default function TokenSelectGrid({
                                            value,
                                            onChange,
                                            title = 'Escolha a cripto',
                                        }: {
    value: string;
    onChange: (v: string) => void;
    title?: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="mb-3 text-xs text-white/60">{title}</div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {TOKENS.map((t) => {
                    const active = t.code === value;
                    return (
                        <button
                            key={t.code}
                            onClick={() => onChange(t.code)}
                            className={[
                                'group flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition',
                                active
                                    ? 'border-emerald-400/50 bg-emerald-400/10'
                                    : 'border-white/10 bg-black/20 hover:border-white/25',
                            ].join(' ')}
                        >
                            <div className="shrink-0 text-white">
                                <TokenLogo symbol={t.code} />
                            </div>
                            <div className="min-w-0">
                                <div className="truncate text-sm text-white">{t.name}</div>
                                <div className="text-[11px] text-white/50">{t.code}{t.note ? ` · ${t.note}` : ''}</div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
