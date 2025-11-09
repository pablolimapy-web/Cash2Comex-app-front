'use client';
import { CheckCircle2, Info } from 'lucide-react';

export default function QuoteSummary({
                                         approxFiat,
                                         approxCrypto,
                                         feePct,
                                         feeFixed,
                                         rate,
                                         side,
                                     }: {
    approxFiat: number;
    approxCrypto: number;
    feePct: number;
    feeFixed: number;
    rate: number;
    side: 'buy' | 'sell';
}) {
    const fmt = (n?: number) =>
        Number.isFinite(n as number)
            ? (n as number).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : '0,00';


    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">Valor aproximado final</div>
                <div className="text-xs text-white/50">Taxa {Math.round(feePct*100)}% + R$ {fmt(feeFixed)}</div>
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-white">
                {side === 'sell'
                    ? `R$ ${fmt(approxFiat)}`
                    : `${Number.isFinite(approxCrypto) ? approxCrypto.toFixed(6) : '0.000000'} CRYPTO`}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-white/50">
                <Info size={14}/> 1 CRYPTO ≈ R$ {fmt(rate)} (mock)
            </div>
        </div>
    );
}
