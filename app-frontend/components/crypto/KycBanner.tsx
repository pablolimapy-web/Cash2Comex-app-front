'use client';
import { ShieldCheck } from 'lucide-react';

export default function KycBanner() {
    return (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
            <div className="flex items-center gap-2 text-sm">
                <ShieldCheck size={16}/>
                Para limites maiores, conclua seu KYC após criar a conta.
            </div>
        </div>
    );
}
