'use client';

import { Activity, Network, Link as LinkIcon } from 'lucide-react';

const NETWORKS = [
    { id: 'Arbitrum', icon: <Activity size={16} /> },
    { id: 'Ethereum', icon: <Network size={16} /> },
    { id: 'Polygon', icon: <LinkIcon size={16} /> },
] as const;

export default function NetworkPills({
                                         value,
                                         onChange,
                                     }: {
    value: string;
    onChange: (v: any) => void;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="text-xs text-white/60">Rede</div>
            <div className="mt-2 flex flex-wrap gap-2">
                {NETWORKS.map((n) => {
                    const active = value === n.id;
                    return (
                        <button
                            key={n.id}
                            onClick={() => onChange(n.id)}
                            className={[
                                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition',
                                active
                                    ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200'
                                    : 'border-white/10 bg-black/20 text-white/80 hover:border-white/25',
                            ].join(' ')}
                        >
                            <span className="opacity-80">{n.icon}</span>
                            {n.id}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
