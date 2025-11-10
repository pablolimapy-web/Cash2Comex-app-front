'use client';
import { ChevronDown } from 'lucide-react';
import NetworkLogo from '@/components/crypto/NetworkLogo';

export default function NetworkSelectTrigger({
                                                 id, title, badge, onOpen
                                             }: { id: string; title: string; badge?: string; onOpen: () => void }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="text-xs text-white/60">Receber na rede</div>
            <button
                type="button"
                onClick={onOpen}
                className="mt-2 flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-white/90"
            >
        <span className="flex items-center gap-2">
          <NetworkLogo id={id} size={20} />
          <span>{title}</span>
            {badge && (
                <span className="ml-2 rounded-full bg-emerald-500/10 px-2 py-[2px] text-[10px] font-semibold text-emerald-400">
              {badge}
            </span>
            )}
        </span>
                <ChevronDown className="opacity-60" size={18} />
            </button>
        </div>
    );
}
