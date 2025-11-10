'use client';
import { ChevronDown } from 'lucide-react';
import TokenLogo from '@/components/crypto/TokenLogo';

export default function CurrencySelectTrigger({
                                                  label, code, name, subtitle, onOpen
                                              }: { label: string; code: string; name: string; subtitle?: string; onOpen: () => void }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="text-xs text-white/60">{label}</div>
            <button
                type="button"
                onClick={onOpen}
                className="mt-2 flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-white/90"
            >
        <span className="flex items-center gap-2">
          <TokenLogo symbol={code} size={18} />
          <div className="flex flex-col">
            <span className="font-medium">{code} <span className="text-white/60">— {name}</span></span>
              {subtitle && <span className="text-xs text-white/45">{subtitle}</span>}
          </div>
        </span>
                <ChevronDown className="opacity-60" size={18} />
            </button>
        </div>
    );
}
