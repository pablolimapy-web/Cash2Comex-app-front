'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, BadgePercent, Coins, Filter } from 'lucide-react';

type Status = 'todas' | 'finalizada' | 'pendente';

type Linha = {
    id: string;
    data: string; // ISO
    tipo: 'Compra' | 'Venda';
    protocolo: string;
    nome: string;
    valorOrigem: number; // BRL
    moeda: 'BRL' | 'USDT' | 'USD';
    comissao: number; // BRL
    cupom: string;
    status: Exclude<Status, 'todas'>;
};

const MOCK: Linha[] = [
    { id: '1', data: '2025-11-06', tipo: 'Compra', protocolo: 'C2C-18421', nome: 'João Silva', valorOrigem: 1500, moeda: 'BRL', comissao: 45, cupom: 'PABLO10', status: 'finalizada' },
    { id: '2', data: '2025-10-28', tipo: 'Compra', protocolo: 'C2C-18212', nome: 'Eduardo Lima', valorOrigem: 2200, moeda: 'BRL', comissao: 66, cupom: 'MEGA15', status: 'finalizada' },
    { id: '3', data: '2025-11-08', tipo: 'Venda', protocolo: 'C2C-19002', nome: 'Maria Souza', valorOrigem: 980, moeda: 'BRL', comissao: 29.4, cupom: 'PABLO10', status: 'pendente' },
];

const moedaBRL = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function ExtratoAfiliadoPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(t);
    }, []);

    const [tab, setTab] = useState<Status>('todas');
    const [start, setStart] = useState<string>('2020-10-01');
    const [end, setEnd] = useState<string>('2025-11-09');
    const [cupom, setCupom] = useState<string>('');
    const [moeda, setMoeda] = useState<string>('');

    const cupons = useMemo(() => Array.from(new Set(MOCK.map((m) => m.cupom))).sort(), []);
    const moedas = useMemo(() => Array.from(new Set(MOCK.map((m) => m.moeda))).sort(), []);

    const totalFinalizadas = useMemo(
        () => MOCK.filter((l) => l.status === 'finalizada').reduce((s, l) => s + l.comissao, 0),
        []
    );
    const totalPendentes = useMemo(
        () => MOCK.filter((l) => l.status === 'pendente').reduce((s, l) => s + l.comissao, 0),
        []
    );
    const saldoDisponivel = totalFinalizadas; // mock

    const linhas = useMemo(() => {
        return MOCK.filter((l) => {
            if (tab !== 'todas' && l.status !== tab) return false;
            if (start && l.data < start) return false;
            if (end && l.data > end) return false;
            if (cupom && l.cupom !== cupom) return false;
            if (moeda && l.moeda !== (moeda as any)) return false;
            return true;
        });
    }, [tab, start, end, cupom, moeda]);

    return (
        <section className="space-y-6 p-6">
            {/* Cabeçalho */}
            <div
                className={[
                    'transition-all duration-500',
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
                ].join(' ')}
            >
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Minhas comissões</h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-white/70">
                    Acompanhe todas as suas comissões.
                </p>
            </div>

            {/* Cards */}
            <div
                className={[
                    'grid gap-4 md:grid-cols-3 transition-all duration-500 delay-75',
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
                ].join(' ')}
            >
                {/* Saldo disponível */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#101621]">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700 dark:text-white/80">Saldo disponível na conta</span>
                        <button
                            className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-500/15 dark:border-purple-400/30 dark:bg-purple-500/20 dark:text-purple-200 dark:hover:bg-purple-500/30"
                            type="button"
                        >
                            Sacar saldo
                        </button>
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                        {moedaBRL(saldoDisponivel)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-white/60">USDT 0</div>
                </div>

                {/* Confirmadas */}
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500/90" />
                        Comissões confirmadas
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-emerald-700 dark:text-emerald-100">
                        {moedaBRL(totalFinalizadas)}
                    </div>
                </div>

                {/* Pendentes */}
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 dark:border-amber-500/20 dark:bg-amber-500/10">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500/90" />
                        Comissões pendentes
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-amber-700 dark:text-amber-100">
                        {moedaBRL(totalPendentes)}
                    </div>
                </div>
            </div>

            {/* Abas */}
            <div
                className={[
                    'grid grid-cols-1 gap-3 md:grid-cols-3 transition-all duration-500 delay-100',
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
                ].join(' ')}
            >
                <button
                    onClick={() => setTab('todas')}
                    className={[
                        'h-11 rounded-xl text-sm font-semibold transition',
                        tab === 'todas'
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                            : 'bg-white dark:bg-[#101621] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-white/5',
                    ].join(' ')}
                >
                    Todas
                </button>

                <button
                    onClick={() => setTab('finalizada')}
                    className={[
                        'h-11 rounded-xl text-sm font-semibold transition',
                        tab === 'finalizada'
                            ? 'bg-purple-600 text-white hover:bg-purple-500'
                            : 'bg-white dark:bg-[#101621] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-white/5',
                    ].join(' ')}
                >
                    Finalizadas
                </button>

                <button
                    onClick={() => setTab('pendente')}
                    className={[
                        'h-11 rounded-xl text-sm font-semibold transition',
                        tab === 'pendente'
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                            : 'bg-white dark:bg-[#101621] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-white/5',
                    ].join(' ')}
                >
                    Pendentes
                </button>
            </div>

            {/* Filtros (linha única no desktop) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#0d1117]">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Data inicial */}
                    <div className="min-w-0">
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-white/85">
                            Início
                        </label>
                        <div className="relative">
                            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white/50" />
                            <input
                                type="date"
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                                className="form-input h-11 w-full pl-9 dark:bg-[#121821]"
                            />
                        </div>
                    </div>

                    {/* Data final */}
                    <div className="min-w-0">
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-white/85">
                            Fim
                        </label>
                        <div className="relative">
                            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white/50" />
                            <input
                                type="date"
                                value={end}
                                onChange={(e) => setEnd(e.target.value)}
                                className="form-input h-11 w-full pl-9 dark:bg-[#121821]"
                            />
                        </div>
                    </div>

                    {/* Cupom */}
                    <div className="min-w-0">
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-white/85">
                            Cupom
                        </label>
                        <div className="relative">
                            <BadgePercent className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white/50" />
                            <select
                                value={cupom}
                                onChange={(e) => setCupom(e.target.value)}
                                className="form-select h-11 w-full pl-9 dark:bg-[#121821]"
                            >
                                <option value="">Selecionar cupom</option>
                                {cupons.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Moeda */}
                    <div className="min-w-0">
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-white/85">
                            Moeda
                        </label>
                        <div className="relative">
                            <Coins className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white/50" />
                            <select
                                value={moeda}
                                onChange={(e) => setMoeda(e.target.value)}
                                className="form-select h-11 w-full pl-9 dark:bg-[#121821]"
                            >
                                <option value="">Selecionar moeda</option>
                                {moedas.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <div
                className={[
                    'rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0d1117] transition-all duration-500 delay-200',
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
                ].join(' ')}
            >
                <div className="table-responsive">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="text-left">
                            {[
                                'Data',
                                'Tipo',
                                'Protocolo',
                                'Nome',
                                'Valor de origem',
                                'Moedas',
                                'Comissão',
                                'Cupom',
                                'Status',
                            ].map((h, i) => (
                                <th
                                    key={h}
                                    className={`bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-[#0f1520] dark:text-white/70 ${
                                        i === 0 ? 'first:rounded-tl-2xl' : i === 8 ? 'last:rounded-tr-2xl' : ''
                                    }`}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#141b26]">
                        {linhas.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="px-6 py-10">
                                    <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50/60 p-6 text-slate-500 dark:border-[#1c2533] dark:bg-[#0f1520] dark:text-white/60">
                                        <Filter className="h-4 w-4" />
                                        <span className="text-sm">Nenhuma transação foi encontrada</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            linhas.map((l) => (
                                <tr key={l.id} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-[#0f1520]">
                                    <td className="px-4 py-3 text-slate-700 dark:text-white/85">
                                        {new Date(l.data).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-4 py-3 text-slate-700 dark:text-white/85">{l.tipo}</td>
                                    <td className="px-4 py-3 text-slate-700 dark:text-white/85">{l.protocolo}</td>
                                    <td className="px-4 py-3 text-slate-700 dark:text-white/85">{l.nome}</td>
                                    <td className="px-4 py-3 text-slate-700 dark:text-white/85">{moedaBRL(l.valorOrigem)}</td>
                                    <td className="px-4 py-3 text-slate-700 dark:text-white/85">{l.moeda}</td>
                                    <td className="px-4 py-3 text-slate-700 dark:text-white/85">{moedaBRL(l.comissao)}</td>
                                    <td className="px-4 py-3 text-slate-700 dark:text-white/85">{l.cupom}</td>
                                    <td className="px-4 py-3">
                      <span
                          className={[
                              'rounded-full px-2.5 py-1 text-xs font-semibold',
                              l.status === 'finalizada'
                                  ? 'border border-emerald-400/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                  : 'border border-amber-400/30 bg-amber-500/10 text-amber-700 dark:text-amber-200',
                          ].join(' ')}
                      >
                        {l.status === 'finalizada' ? 'Finalizada' : 'Pendente'}
                      </span>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rodapé */}
            <p className="pt-6 text-center text-xs text-slate-500 dark:text-white/40">
                © 2025. Cash2Comex. Todos os direitos reservados.
            </p>
        </section>
    );
}
