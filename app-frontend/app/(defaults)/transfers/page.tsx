'use client';

import { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import TransferModal from '@/components/transfers/TransferModal';
import PixFlowModal from '@/components/transfers/PixFlowModal';
import Transfer4PayModal from '@/components/transfers/Transfer4PayModal';

export default function TransfersPage() {
    // troque por fetch real
    const [hasTransfers] = useState(false);

    // modais
    const [openChooser, setOpenChooser] = useState(false);
    const [openPix, setOpenPix] = useState(false);
    const [open4pay, setOpen4pay] = useState(false);

    // animação
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(t);
    }, []);

    const handlePick = (type: 'pix' | '4pay' | 'crypto') => {
        setOpenChooser(false);
        if (type === 'pix') setOpenPix(true);
        if (type === '4pay') setOpen4pay(true);
    };

    return (
        <section className="space-y-6 p-6">
            {/* Cabeçalho */}
            <div className={mounted ? 'animate-slide-up' : 'opacity-0 translate-y-3'}>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Transferências</h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-white/70">
                    Acompanhe todas as suas transferências pela 4Pay.
                </p>
            </div>

            {!hasTransfers ? (
                <div className={mounted ? 'rounded-2xl border border-slate-200 bg-white/70 p-8 text-center shadow-sm dark:border-[#1c2533] dark:bg-[#0d1117] animate-pop-in' : 'opacity-0 scale-95'}>
                    <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-xl bg-slate-100 dark:bg-white/5">
                        <CreditCard className="h-7 w-7 text-slate-500 dark:text-white/70" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Nenhuma transferência foi feita</h2>
                    <p className="mx-auto mt-1 max-w-xl text-sm text-slate-600 dark:text-white/70">
                        Você ainda não fez nenhuma transferência pela 4Pay. Inicie sua experiência transferindo via conta 4Pay ou via PIX.
                    </p>
                    <button
                        onClick={() => setOpenChooser(true)}
                        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow hover:bg-blue-500 active:scale-[.98]"
                    >
                        Transferir
                    </button>
                </div>
            ) : (
                <div className={mounted ? 'rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#1c2533] dark:bg-[#0d1117] animate-fade-in' : 'opacity-0'}>
                    {/* sua lista real aqui */}
                </div>
            )}

            <TransferModal open={openChooser} onClose={() => setOpenChooser(false)} onPick={handlePick} />
            <PixFlowModal open={openPix} onClose={() => setOpenPix(false)} />
            <Transfer4PayModal open={open4pay} onClose={() => setOpen4pay(false)} />
        </section>
    );
}
