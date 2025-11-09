'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { X, User, CreditCard } from 'lucide-react';

type Tab = 'account' | 'cpf' | 'cnpj';

export default function Transfer4PayModal({
                                              open,
                                              onClose,
                                          }: {
    open: boolean;
    onClose: () => void;
}) {
    const [tab, setTab] = useState<Tab>('account');

    // Campos
    const [account, setAccount] = useState('');      // número 4Pay
    const [cpf, setCpf] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [amount, setAmount] = useState('');        // texto com máscara
    const [beneficiary, setBeneficiary] = useState<string | null>(null);

    const modalRef = useRef<HTMLDivElement>(null);

    // Fecha com ESC e clique fora
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        const onClick = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener('keydown', onKey);
        document.addEventListener('mousedown', onClick);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('mousedown', onClick);
        };
    }, [open, onClose]);

    // Máscaras simples
    const fmtMoney = (v: string) => {
        const num = v.replace(/\D/g, '');
        if (!num) return '';
        const int = num.replace(/^0+/, '');
        const value = (Number(int) / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        });
        return value;
    };

    const onMoney = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(fmtMoney(e.target.value));
    };

    const maskCPF = (v: string) =>
        v
            .replace(/\D/g, '')
            .slice(0, 11)
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    const maskCNPJ = (v: string) =>
        v
            .replace(/\D/g, '')
            .slice(0, 14)
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1\/$2')
            .replace(/(\d{4})(\d{1,2})$/, '$1-$2');

    // Mock de “buscar beneficiário”
    useEffect(() => {
        setBeneficiary(null);
        const id =
            tab === 'account' ? account.trim() : tab === 'cpf' ? cpf.replace(/\D/g, '') : cnpj.replace(/\D/g, '');
        if (!id) return;

        const t = setTimeout(() => {
            // MOCK: se terminar com número par => encontrado
            const last = id[id.length - 1];
            if (last && Number(last) % 2 === 0) setBeneficiary('Beneficiário Exemplo LTDA');
            else setBeneficiary(null);
        }, 350);

        return () => clearTimeout(t);
    }, [tab, account, cpf, cnpj]);

    const canSubmit = useMemo(() => {
        const hasValue = amount && /\d/.test(amount);
        if (tab === 'account') return account.trim().length >= 3 && hasValue && !!beneficiary;
        if (tab === 'cpf') return cpf.replace(/\D/g, '').length === 11 && hasValue && !!beneficiary;
        return cnpj.replace(/\D/g, '').length === 14 && hasValue && !!beneficiary;
    }, [tab, account, cpf, cnpj, amount, beneficiary]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

            {/* modal */}
            <div
                ref={modalRef}
                className="
          relative z-10 w-[92vw] max-w-[540px] rounded-2xl border
          bg-white p-5 shadow-xl
          border-slate-200
          dark:bg-[#0b0f14] dark:border-[#1c2533]
        "
            >
                {/* header */}
                <div className="mb-4 flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Transferência entre contas 4Pay
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-white/60">
                            Saldo disponível: <span className="font-semibold">R$ 0,00</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-white/60 dark:hover:bg-white/10"
                        aria-label="Fechar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* tabs */}
                <div className="mb-4 flex items-center gap-4 border-b border-slate-200 pb-2 dark:border-[#1c2533]">
                    <TabBtn current={tab} id="account" onClick={() => setTab('account')} label="Conta 4Pay" />
                    <TabBtn current={tab} id="cpf" onClick={() => setTab('cpf')} label="CPF" />
                    <TabBtn current={tab} id="cnpj" onClick={() => setTab('cnpj')} label="CNPJ" />
                </div>

                {/* form */}
                <div className="space-y-3">
                    {tab === 'account' && (
                        <>
                            <Field label="Número da conta" htmlFor="acc">
                                <input
                                    id="acc"
                                    placeholder="Digitar número"
                                    value={account}
                                    onChange={(e) => setAccount(e.target.value)}
                                    className="form-input bg-white dark:bg-[#121e32] dark:border-[#17263c] dark:text-white"
                                />
                            </Field>
                        </>
                    )}

                    {tab === 'cpf' && (
                        <>
                            <Field label="CPF do recebedor" htmlFor="cpf">
                                <input
                                    id="cpf"
                                    inputMode="numeric"
                                    placeholder="000.000.000-00"
                                    value={cpf}
                                    onChange={(e) => setCpf(maskCPF(e.target.value))}
                                    className="form-input bg-white dark:bg-[#121e32] dark:border-[#17263c] dark:text-white"
                                />
                            </Field>
                        </>
                    )}

                    {tab === 'cnpj' && (
                        <>
                            <Field label="CNPJ do recebedor" htmlFor="cnpj">
                                <input
                                    id="cnpj"
                                    inputMode="numeric"
                                    placeholder="00.000.000/0000-00"
                                    value={cnpj}
                                    onChange={(e) => setCnpj(maskCNPJ(e.target.value))}
                                    className="form-input bg-white dark:bg-[#121e32] dark:border-[#17263c] dark:text-white"
                                />
                            </Field>
                        </>
                    )}

                    {/* Beneficiário */}
                    <div className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm
                          border-slate-200 dark:border-[#173046] bg-slate-50/50 dark:bg-[#0e1722]">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-500 dark:text-white/50" />
                            <span className="text-slate-700 dark:text-white/80">Beneficiário</span>
                        </div>
                        <span
                            className={
                                beneficiary
                                    ? 'rounded-full bg-emerald-600/15 px-2 py-0.5 text-xs font-semibold text-emerald-400'
                                    : 'rounded-full bg-slate-500/20 px-2 py-0.5 text-xs font-semibold text-slate-400 dark:text-white/50'
                            }
                        >
              {beneficiary ?? 'Não encontrado'}
            </span>
                    </div>

                    {/* Valor */}
                    <Field label="Valor" htmlFor="vlr">
                        <div className="relative">
                            <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white/50" />
                            <input
                                id="vlr"
                                placeholder="R$ 0,00"
                                value={amount}
                                onChange={onMoney}
                                className="form-input pl-9 bg-white dark:bg-[#121e32] dark:border-[#17263c] dark:text-white"
                            />
                        </div>
                    </Field>
                </div>

                {/* footer */}
                <div className="mt-5">
                    <button
                        disabled={!canSubmit}
                        className="
              h-11 w-full rounded-xl text-sm font-semibold text-slate-900 transition
              bg-[#c8d164] hover:bg-[#b8c152]
              disabled:cursor-not-allowed disabled:opacity-60
            "
                        onClick={() => {
                            // submit mock
                            onClose();
                        }}
                    >
                        Finalizar transferência
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ----------------- helpers ----------------- */

function TabBtn({
                    current,
                    id,
                    label,
                    onClick,
                }: {
    current: Tab;
    id: Tab;
    label: string;
    onClick: () => void;
}) {
    const active = current === id;
    return (
        <button
            onClick={onClick}
            className={`
        relative pb-2 text-sm font-semibold transition-colors
        ${active ? 'text-amber-400' : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'}
      `}
        >
            {label}
            {active && (
                <span className="absolute -bottom-[1px] left-0 h-[2px] w-full rounded bg-amber-400" />
            )}
        </button>
    );
}

function Field({
                   label,
                   htmlFor,
                   children,
               }: {
    label: string;
    htmlFor?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-white/70">
        {label}
      </span>
            {children}
        </label>
    );
}
