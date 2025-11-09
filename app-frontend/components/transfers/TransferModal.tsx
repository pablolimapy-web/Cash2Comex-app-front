'use client';

import { useEffect, useState } from 'react';
import {
    X,
    Landmark,
    Wallet,
    Bitcoin,
    ChevronRight,
    Zap,
} from 'lucide-react';

/* ===========================
 * Utils: máscara e validação
 * =========================== */
const onlyDigits = (s: string) => s.replace(/\D/g, '');

export function formatCPF(v: string) {
    const d = onlyDigits(v).slice(0, 11);
    return d
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function formatCNPJ(v: string) {
    const d = onlyDigits(v).slice(0, 14);
    return d
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
}

export function isValidCPF(value: string) {
    const v = onlyDigits(value);
    if (v.length !== 11) return false;
    if (/^(\d)\1+$/.test(v)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(v.charAt(i)) * (10 - i);
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(v.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(v.charAt(i)) * (11 - i);
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    return rev === parseInt(v.charAt(10));
}

export function isValidCNPJ(value: string) {
    const v = onlyDigits(value);
    if (v.length !== 14) return false;
    if (/^(\d)\1+$/.test(v)) return false;

    const calc = (base: string, factors: number[]) =>
        factors.reduce((total, factor, i) => total + parseInt(base[i]) * factor, 0);

    let base = v.slice(0, 12);
    let factors = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = calc(base, factors);
    let rev = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (rev !== parseInt(v.charAt(12))) return false;

    base = v.slice(0, 13);
    factors = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = calc(base, factors);
    rev = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return rev === parseInt(v.charAt(13));
}

function formatBRLNumberInput(v: string) {
    const digits = v.replace(/\D/g, '');
    const cents = (parseInt(digits || '0', 10) / 100).toFixed(2);
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
        .format(Number(cents))
        .replace('R$', '')
        .trim();
}

/* ============
 * Modal Shell
 * ============ */
type Step = 'menu' | 'pix' | 'internal';

export default function TransferModal({
                                          open,
                                          onClose,
                                      }: {
    open: boolean;
    onClose: () => void;
}) {
    const [step, setStep] = useState<Step>('menu');

    // reset ao fechar
    useEffect(() => {
        if (!open) setStep('menu');
    }, [open]);

    // fechar com ESC
    useEffect(() => {
        const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', h);
        return () => document.removeEventListener('keydown', h);
    }, [onClose]);

    if (!open) return null;

    return (
        <div
            aria-hidden={false}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[100] grid place-items-center"
        >
            {/* Overlay */}
            <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

            <div className="relative z-[101] w-[min(700px,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl outline-none dark:border-[#1c2533] dark:bg-[#0d1117]">
                <header className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {step === 'menu'
                            ? 'Realizar transferência'
                            : step === 'pix'
                                ? 'Transferência via Pix'
                                : 'Transferência entre contas 4Pay'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="grid h-8 w-8 place-items-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-white/70 dark:hover:bg-white/10"
                        aria-label="Fechar"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </header>

                {step === 'menu' && (
                    <MenuView goPix={() => setStep('pix')} goInternal={() => setStep('internal')} />
                )}
                {step === 'pix' && <PixView />}
                {step === 'internal' && <Internal4PayView />}
            </div>
        </div>
    );
}

/* ============
 * Menu inicial
 * ============ */
function MenuView({ goPix, goInternal }: { goPix: () => void; goInternal: () => void }) {
    return (
        <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-white/70">
                Escolha qual a forma de transferência você deseja utilizar.
            </p>

            <ul className="space-y-3">
                {/* Pix */}
                <li>
                    <button
                        onClick={goPix}
                        className="group flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50 dark:border-[#1c2533] dark:bg-[#0f1520] dark:hover:bg-[#101621]"
                    >
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                            <Landmark className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white">Pix</div>
                            <div className="text-xs text-slate-600 dark:text-white/70">
                                Transferência instantânea via Pix
                            </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5" />
                    </button>
                </li>

                {/* Entre contas 4Pay */}
                <li>
                    <button
                        onClick={goInternal}
                        className="group flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50 dark:border-[#1c2533] dark:bg-[#0f1520] dark:hover:bg-[#101621]"
                    >
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                            <Wallet className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white">
                                Transferir entre contas 4Pay
                            </div>
                            <div className="text-xs text-slate-600 dark:text-white/70">
                                Utilize número da conta ou CPF/CNPJ
                            </div>
                            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <Zap className="h-3 w-3" /> Transferência imediata
              </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5" />
                    </button>
                </li>

                {/* Cripto (em breve) */}
                <li>
                    <button
                        disabled
                        className="flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left opacity-60 dark:border-[#1c2533] dark:bg-[#0f1520]"
                    >
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                            <Bitcoin className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white">
                                Transferência de criptomoeda
                                <span className="ml-2 align-middle">
                  <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-white/10 dark:text-white/70">
                    Em breve
                  </span>
                </span>
                            </div>
                            <div className="text-xs text-slate-600 dark:text-white/70">
                                Use o saldo da sua conta para transferir cripto.
                            </div>
                        </div>
                    </button>
                </li>
            </ul>
        </div>
    );
}

/* ============
 * Pix
 * ============ */
function PixView() {
    const [key, setKey] = useState('');
    const [recipient, setRecipient] = useState('');
    const [bank, setBank] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (key.trim().length >= 4) {
            setRecipient('Pablo Miguel de Oliveira Lima');
            setBank('NU PAGAMENTOS - IP');
        } else {
            setRecipient('');
            setBank('');
        }
    }, [key]);

    const canSend = key && recipient && bank && !!amount && amount !== '0,00';

    return (
        <form
            className="space-y-4"
            onSubmit={(e) => {
                e.preventDefault();
                // TODO: enviar para sua API
            }}
        >
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-600 dark:border-[#1c2533] dark:bg-[#0f1520] dark:text-white/70">
                Saldo disponível: <span className="font-semibold">R$ 0,00</span>
            </div>

            <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white/90">
                    Para quem você quer enviar?
                </label>
                <p className="mb-2 text-xs text-slate-500 dark:text-white/60">
                    Informe a chave PIX do destinatário
                </p>
                <input
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Digite a chave"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-[#1c2533] dark:bg-[#0f1520] dark:text-white dark:placeholder:text-white/40 dark:focus:border-blue-500"
                />
            </div>

            {recipient && bank && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-600/10 p-4 dark:border-emerald-400/20 dark:bg-emerald-500/10">
                    <div className="grid gap-3">
                        <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-white/90">
                Destinatário
              </span>
                            <span className="text-sm text-slate-900 dark:text-white">{recipient}</span>
                        </div>
                        <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-white/90">
                Banco
              </span>
                            <span className="text-sm text-slate-900 dark:text-white">{bank}</span>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white/90">
                    Quanto você quer enviar?
                </label>
                <p className="mb-2 text-xs text-slate-500 dark:text-white/60">
                    Informe o valor que deseja enviar
                </p>
                <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 dark:text-white/60">
            R$
          </span>
                    <input
                        value={amount}
                        onChange={(e) => setAmount(formatBRLNumberInput(e.target.value))}
                        inputMode="numeric"
                        placeholder="0,00"
                        className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-[#1c2533] dark:bg-[#0f1520] dark:text-white dark:placeholder:text-white/40 dark:focus:border-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white/90">
                    Escreva uma mensagem <span className="text-slate-400">Opcional</span>
                </label>
                <p className="mb-2 text-xs text-slate-500 dark:text-white/60">
                    Ela aparecerá para o destinatário no comprovante da transferência
                </p>
                <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Sua mensagem aqui…"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-[#1c2533] dark:bg-[#0f1520] dark:text-white dark:placeholder:text-white/40 dark:focus:border-blue-500"
                />
            </div>

            <button
                type="submit"
                disabled={!canSend}
                className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow hover:bg-blue-500 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
                Finalizar transferência
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                </svg>
            </button>
        </form>
    );
}

/* =========================================
 * Transferência entre contas 4Pay (interno)
 * ========================================= */
type InternalTab = 'account' | 'cpf' | 'cnpj';

function Internal4PayView() {
    const [tab, setTab] = useState<InternalTab>('account');

    // estados comuns
    const [beneficiary, setBeneficiary] = useState<string | null>(null);
    const [amount, setAmount] = useState('');

    // campos de cada aba
    const [account, setAccount] = useState('');
    const [cpf, setCpf] = useState('');
    const [cnpj, setCnpj] = useState('');

    // validações
    const accountValid = onlyDigits(account).length >= 4; // ajuste conforme sua regra
    const cpfValid = isValidCPF(cpf);
    const cnpjValid = isValidCNPJ(cnpj);

    const isAmountValid = amount && amount !== '0,00';

    const canSubmit =
        tab === 'account'
            ? accountValid && !!beneficiary && isAmountValid
            : tab === 'cpf'
                ? cpfValid && !!beneficiary && isAmountValid
                : cnpjValid && !!beneficiary && isAmountValid;

    // mock: “resolver” beneficiário quando dados ficarem válidos
    useEffect(() => {
        setBeneficiary(null);
        if (tab === 'account' && accountValid) {
            setBeneficiary('Beneficiário 4Pay');
        }
        if (tab === 'cpf' && cpfValid) {
            setBeneficiary('Beneficiário CPF');
        }
        if (tab === 'cnpj' && cnpjValid) {
            setBeneficiary('Beneficiário CNPJ');
        }
    }, [tab, accountValid, cpfValid, cnpjValid]);

    return (
        <form
            className="space-y-5"
            onSubmit={(e) => {
                e.preventDefault();
                // TODO: enviar para API
            }}
        >
            {/* saldo */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-600 dark:border-[#1c2533] dark:bg-[#0f1520] dark:text-white/70">
                Saldo disponível: <span className="font-semibold">R$ 0,00</span>
            </div>

            {/* Abas */}
            <div className="flex gap-2 border-b border-slate-200 pb-2 dark:border-[#1c2533]">
                {([
                    { id: 'account', label: 'Conta 4Pay' },
                    { id: 'cpf', label: 'CPF' },
                    { id: 'cnpj', label: 'CNPJ' },
                ] as const).map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setTab(t.id)}
                        className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                            tab === t.id
                                ? 'bg-amber-300/30 text-amber-900 dark:bg-amber-300/20 dark:text-amber-200'
                                : 'text-slate-600 hover:bg-slate-100 dark:text-white/70 dark:hover:bg-white/10'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Campo principal por aba */}
            {tab === 'account' && (
                <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white/90">
                        Número da conta
                    </label>
                    <p className="mb-2 text-xs text-slate-500 dark:text-white/60">
                        Informe o número da conta 4Pay
                    </p>
                    <input
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        placeholder="Digitar número"
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-[#1c2533] dark:bg-[#0f1520] dark:text-white dark:placeholder:text-white/40 dark:focus:border-blue-500"
                    />
                </div>
            )}

            {tab === 'cpf' && (
                <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white/90">
                        CPF do recebedor
                    </label>
                    <input
                        value={cpf}
                        onChange={(e) => setCpf(formatCPF(e.target.value))}
                        placeholder="000.000.000-00"
                        className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition
              bg-white text-slate-900 placeholder:text-slate-400
              ${cpf.length === 0 || cpfValid ? 'border-slate-300 focus:border-blue-500' : 'border-rose-400 focus:border-rose-500'}
              dark:bg-[#0f1520] dark:text-white
              ${
                            cpf.length === 0 || cpfValid
                                ? 'dark:border-[#1c2533] dark:focus:border-blue-500'
                                : 'dark:border-rose-500 dark:focus:border-rose-500'
                        }`}
                    />
                    {cpf.length > 0 && !cpfValid && (
                        <p className="mt-1 text-xs text-rose-500">CPF inválido para este campo.</p>
                    )}
                </div>
            )}

            {tab === 'cnpj' && (
                <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white/90">
                        CNPJ do recebedor
                    </label>
                    <input
                        value={cnpj}
                        onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                        placeholder="00.000.000/0000-00"
                        className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition
              bg-white text-slate-900 placeholder:text-slate-400
              ${cnpj.length === 0 || cnpjValid ? 'border-slate-300 focus:border-blue-500' : 'border-rose-400 focus:border-rose-500'}
              dark:bg-[#0f1520] dark:text-white
              ${
                            cnpj.length === 0 || cnpjValid
                                ? 'dark:border-[#1c2533] dark:focus:border-blue-500'
                                : 'dark:border-rose-500 dark:focus:border-rose-500'
                        }`}
                    />
                    {cnpj.length > 0 && !cnpjValid && (
                        <p className="mt-1 text-xs text-rose-500">CNPJ inválido para este campo.</p>
                    )}
                </div>
            )}

            {/* Beneficiário */}
            <div
                className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm transition
          ${beneficiary ? 'border-emerald-400/30 bg-emerald-500/10' : 'border-slate-300 bg-slate-50/60 dark:border-[#1c2533] dark:bg-[#0f1520]'}`}
            >
                <span className="font-semibold text-slate-700 dark:text-white/90">Beneficiário</span>
                <span className={`text-sm ${beneficiary ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-500 dark:text-white/60'}`}>
          {beneficiary ?? 'Não encontrado'}
        </span>
            </div>

            {/* Valor */}
            <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white/90">
                    Valor
                </label>
                <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 dark:text-white/60">
            R$
          </span>
                    <input
                        value={amount}
                        onChange={(e) => setAmount(formatBRLNumberInput(e.target.value))}
                        inputMode="numeric"
                        placeholder="0,00"
                        className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-[#1c2533] dark:bg-[#0f1520] dark:text-white dark:placeholder:text-white/40 dark:focus:border-blue-500"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={!canSubmit}
                className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-lg bg-amber-300/90 px-5 text-sm font-semibold text-slate-900 shadow hover:bg-amber-300 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
                Finalizar transferência
            </button>
        </form>
    );
}
