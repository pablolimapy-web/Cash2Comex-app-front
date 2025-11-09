'use client';

import { useMemo, useState } from 'react';
import { Plus, CalendarDays, ReceiptText } from 'lucide-react';
import PayBoletoModal, { DecodedBoleto } from '@/components/payments/PayBoletoModal';

type PaymentRow = {
    id: string;
    contaId: string;
    data: string; // ISO
    moeda: 'BRL';
    valorBRL: number; // centavos
    vencimento?: string; // ISO
    status: 'A pagar' | 'Pago' | 'Em análise';
};

const MOCK_ROWS: PaymentRow[] = [
    { id: '341-000-123', contaId: '7210-0', data: '2025-11-08', vencimento: '2025-11-10', moeda: 'BRL', valorBRL: 12990, status: 'A pagar' },
    { id: '756-990-778', contaId: '7210-0', data: '2025-11-06', vencimento: '2025-11-06', moeda: 'BRL', valorBRL: 5900, status: 'Pago' },
];

export default function PaymentsPage() {
    const [open, setOpen] = useState(false);
    const [decoded, setDecoded] = useState<DecodedBoleto | null>(null);

    const totalAPagar = useMemo(
        () => MOCK_ROWS.filter((r) => r.status === 'A pagar').reduce((a, b) => a + b.valorBRL, 0),
        []
    );

    return (
        <section className="space-y-6 p-6">
            {/* Cabeçalho */}
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Pagamento de boletos</h1>
                    <p className="mt-1 text-sm text-slate-600 dark:text-white/70">Acompanhe todos os seus pagamentos.</p>
                </div>

                <button
                    onClick={() => {
                        setDecoded(null);
                        setOpen(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 active:scale-[.98]"
                >
                    <Plus size={16} /> Novo pagamento
                </button>
            </div>

            {/* Filtro (mock) */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-[#1c2533] dark:bg-[#0d1117]">
                <div className="flex flex-wrap items-center gap-3">
                    <label className="text-sm font-semibold text-slate-700 dark:text-white/80">Período</label>
                    <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input type="date" className="form-input pl-9 dark:bg-[#121e32]" defaultValue="2025-11-08" />
                    </div>
                    <span className="text-slate-500 dark:text-white/60">até</span>
                    <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input type="date" className="form-input pl-9 dark:bg-[#121e32]" defaultValue="2025-11-08" />
                    </div>

                    <div className="ml-auto text-sm text-slate-600 dark:text-white/70">
                        Total a pagar:{' '}
                        <span className="font-semibold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAPagar / 100)}
            </span>
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-[#1c2533] dark:bg-[#0d1117]">
                <div className="table-responsive">
                    <table className="w-full">
                        <thead>
                        <tr>
                            {[
                                'Conta/ID',
                                'Data de pagamento',
                                'Moeda',
                                'Valor em BRL',
                                'Vencimento',
                                'Status do pagamento',
                                'Ações',
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-[#0f1520] dark:text-white/70"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#141b26]">
                        {MOCK_ROWS.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-[#0f1520]/60">
                                <td className="px-4 py-3 font-mono text-sm text-slate-700 dark:text-white/80">
                                    {r.contaId} / {r.id}
                                </td>
                                <td className="px-4 py-3 text-slate-700 dark:text-white/80">
                                    {new Date(r.data).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-4 py-3 text-slate-700 dark:text-white/80">BRL</td>
                                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                        r.valorBRL / 100
                                    )}
                                </td>
                                <td className="px-4 py-3 text-slate-700 dark:text-white/80">
                                    {r.vencimento ? new Date(r.vencimento).toLocaleDateString('pt-BR') : '—'}
                                </td>
                                <td className="px-4 py-3">
                    <span
                        className={[
                            'rounded-full px-2.5 py-1 text-xs font-semibold border',
                            r.status === 'Pago'
                                ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : r.status === 'Em análise'
                                    ? 'border-amber-400/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                    : 'border-slate-400/30 bg-slate-500/10 text-slate-700 dark:text-slate-300',
                        ].join(' ')}
                    >
                      {r.status}
                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => {
                                            setDecoded({
                                                amountBRL: r.valorBRL,
                                                dueDate: r.vencimento ?? r.data,
                                                bank: 'Banco Exemplo',
                                                payerName: 'Não identificado',
                                                fine: 0,
                                                interest: 0,
                                                displayName: 'Não identificado',
                                            });
                                            setOpen(true);
                                        }}
                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:border-[#1f2a36] dark:text-white/80 dark:hover:bg-[#19212e]"
                                    >
                                        <ReceiptText size={14} /> Pagar
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {MOCK_ROWS.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-10">
                                    <div className="flex items-center justify-center gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-6 text-slate-500 dark:border-[#1c2533] dark:bg-[#0f1520] dark:text-white/60">
                                        Nenhum pagamento encontrado.
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <PayBoletoModal open={open} onClose={() => setOpen(false)} prefill={decoded ?? undefined} />
        </section>
    );
}
