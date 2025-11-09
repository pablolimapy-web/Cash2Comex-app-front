'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Search } from 'lucide-react';
import Image from 'next/image';

export type SelectItem = {
    id: string;
    title: string;
    subtitle?: string;
    icon?: string;
    renderIcon?: React.ReactNode;
    badge?: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    title: string;
    placeholder?: string;
    items: SelectItem[];
    onSelect: (id: string) => void;

    /** id atual para mostrar highlight */
    selectedId?: string;
};

export default function ModalSelect({
                                        open,
                                        onClose,
                                        title,
                                        placeholder = 'Pesquisar',
                                        items,
                                        onSelect,
                                        selectedId,
                                    }: Props) {
    const [q, setQ] = useState('');

    // filtro simples
    const filtered = useMemo(() => {
        if (!q.trim()) return items;
        const s = q.toLowerCase();
        return items.filter(
            (i) =>
                i.title.toLowerCase().includes(s) ||
                (i.subtitle && i.subtitle.toLowerCase().includes(s)) ||
                (i.id && i.id.toLowerCase().includes(s))
        );
    }, [items, q]);

    // fecha com ESC
    useEffect(() => {
        if (!open) return;
        const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop blur */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Card */}
                    <motion.div
                        key="dialog"
                        initial={{ opacity: 0, y: 16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className="fixed inset-x-0 top-[8vh] z-[90] mx-auto w-full max-w-[560px] rounded-3xl border border-white/10 bg-[#0B0F12]/95 p-4 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-1 pb-2 pt-1">
                            <div>
                                <div className="text-lg font-semibold text-white">{title}</div>
                                <div className="text-xs text-white/60">
                                    Escolha a moeda que deseja utilizar para enviar as criptos.
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white"
                                aria-label="Fechar"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative mt-3">
                            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                            <input
                                autoFocus
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder={placeholder}
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-9 pr-3 py-2.5 text-white/90 outline-none focus:border-white/25"
                            />
                        </div>

                        {/* List */}
                        <div className="mt-3 max-h-[60vh] overflow-auto rounded-2xl">
                            {filtered.map((it) => {
                                const active = it.id === selectedId;
                                return (
                                    <button
                                        key={it.id}
                                        onClick={() => onSelect(it.id)}
                                        className={[
                                            'flex w-full items-center justify-between px-3 py-3',
                                            'border-b border-white/5 last:border-0',
                                            'hover:bg-white/[0.04] text-left transition',
                                            active ? 'bg-white/[0.06]' : '',
                                        ].join(' ')}
                                    >
                    <span className="flex items-center gap-3">
                      {/* Icon */}
                        {it.icon ? (
                            <Image
                                src={it.icon}
                                alt={it.title}
                                width={22}
                                height={22}
                                className="rounded-full"
                            />
                        ) : (
                            <span className="grid h-[22px] w-[22px] place-content-center">{it.renderIcon}</span>
                        )}

                        {/* Texts */}
                        <span className="flex min-w-0 flex-col">
                        <span className="truncate font-medium text-white">{it.title}</span>
                            {it.subtitle && (
                                <span className="truncate text-xs text-white/50">{it.subtitle}</span>
                            )}
                      </span>
                    </span>

                                        {/* Badge / Selected dot */}
                                        <span className="flex items-center gap-2">
                      {it.badge && (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-[2px] text-[10px] font-semibold text-emerald-400">
                          {it.badge}
                        </span>
                      )}
                                            {active && (
                                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                                            )}
                    </span>
                                    </button>
                                );
                            })}

                            {!filtered.length && (
                                <div className="px-3 py-10 text-center text-sm text-white/50">
                                    Nada encontrado para “{q}”.
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
