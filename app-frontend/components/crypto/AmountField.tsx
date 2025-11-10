'use client';

export default function AmountField({
                                        mode,
                                        currency,
                                        value,
                                        onChange,
                                    }: {
    mode: 'buy' | 'sell';
    currency: string;   // ETH/USDT quando sell, 'BRL' quando buy
    value: string;
    onChange: (v: string) => void;
}) {
    const label = mode === 'buy' ? 'Pagar com (BRL)' : 'Pagar com (Cripto)';

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <label className="text-xs text-white/60">{label}</label>
            <div className="mt-2 flex items-center gap-3">
                <input
                    inputMode="decimal"
                    placeholder={mode === 'buy' ? '0,00' : '0.000000'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-lg text-white/90 outline-none focus:border-white/25"
                />
                <span className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white/80">
          {currency}
        </span>
            </div>
        </div>
    );
}
