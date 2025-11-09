'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    X,
    Landmark,
    User2,
    Building2,
    BadgeHelp,
    BadgeCheck,
    CircleAlert,
    Shield,
} from 'lucide-react';

/** Tipos auxiliares */
type PixKeyType = 'cpf' | 'cnpj' | 'phone' | 'email' | 'random' | 'unknown';

function onlyDigits(v: string) {
    return v.replace(/\D+/g, '');
}

function maskCPF(v: string) {
    const d = onlyDigits(v).slice(0, 11);
    return d
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}
function maskCNPJ(v: string) {
    const d = onlyDigits(v).slice(0, 14);
    return d
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
}
function maskPhoneBR(v: string) {
    const d = onlyDigits(v).slice(0, 13); // suporta DDI+DDD+9 números
    if (d.length <= 2) return `+${d}`;
    if (d.length <= 4) return `+${d.slice(0,2)} ${d.slice(2)}`;
    if (d.length <= 6) return `+${d.slice(0,2)} (${d.slice(2,4)}) ${d.slice(4)}`;
    if (d.length <= 10) return `+${d.slice(0,2)} (${d.slice(2,4)}) ${d.slice(4,9)}-${d.slice(9)}`;
    return `+${d.slice(0,2)} (${d.slice(2,4)}) ${d.slice(4,9)}-${d.slice(9,13)}`;
}

function detectPixKeyType(v: string): PixKeyType {
    const s = v.trim();
    const d = onlyDigits(s);
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return 'email';
    if (d.length === 11) return 'cpf';
    if (d.length === 14) return 'cnpj';
    if (s.startsWith('+') || d.length >= 10) return 'phone';
    if (s.length >= 25 && s.length <= 36 && /[a-zA-Z0-9]/.test(s)) return 'random'; // EVP (chave aleatória)
    return 'unknown';
}

function formatBRL(n: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}

/** Props do modal */
export default function PixFlowModal({
                                         open,
                                         onClose,
                                         initialKey,
                                     }: {
    open: boolean;
    onClose: () => void;
    initialKey?: string;
}) {
    const [pixKey, setPixKey] = useState(initialKey ?? '');
    const [amount, setAmount] = useState(''); // exibe 1.234,56
    const [message, setMessage] = useState('');
    const [resolving, setResolving] = useState(false);

    // mock de resolução
    const [recipientName, setRecipientName] = useState('');
    const [recipientBank, setRecipientBank] = useState('');

    // reset ao fechar
    useEffect(() => {
        if (!open) {
            setPixKey(initialKey ?? '');
            setAmount('');
            setMessage('');
            setResolving(false);
            setRecipientName('');
            setRecipientBank('');
        }
    }, [open, initialKey]);

    // fechar com ESC
    useEffect(() => {
        const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', h);
        return () => document.removeEventListener('keydown', h);
    }, [onClose]);

    // aplica máscara conforme o tipo
    const keyType = useMemo(() => detectPixKeyType(pixKey), [pixKey]);

    const maskedKey = useMemo(() => {
        if (!pixKey) return '';
        switch (keyType) {
            case 'cpf': return maskCPF(pixKey);
            case 'cnpj': return maskCNPJ(pixKey);
            case 'phone': return maskPhoneBR(pixKey);
            default: return pixKey;
        }
    }, [pixKey, keyType]);

    const keyError = useMemo(() => {
        if (!pixKey) return '';
        switch (keyType) {
            case 'cpf':
                return onlyDigits(pixKey).length === 11 ? '' : 'CPF incompleto.';
            case 'cnpj':
                return onlyDigits(pixKey).length === 14 ? '' : 'CNPJ incompleto.';
            case 'phone':
                return onlyDigits(pixKey).length >= 10 ? '' : 'Telefone incompleto.';
            case 'email':
            case 'random':
                return '';
            default:
                return 'Tipo de chave inválido ou desconhecido.';
        }
    }, [pixKey, keyType]);

    // máscara do valor (pt-BR)
    function handleAmountInput(v: string) {
        const digits = v.replace(/\D/g, '');
        const cents = Number(digits || '0') / 100;
        setAmount(
            new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents)
        );
    }

    const numericAmount = useMemo(() => {
        const normalized = amount.replace(/\./g, '').replace(',', '.');
        const n = Number(normalized);
        return Number.isFinite(n) ? n : 0;
    }, [amount]);

    const canConfirm = pixKey && !keyError && numericAmount > 0 && recipientName && recipientBank;

    // simula resolução de chave
    async function resolveKey() {
        setResolving(true);
        setRecipientName('');
        setRecipientBank('');
        await new Promise((r) => setTimeout(r, 650)); // mock delay
        // mock result
        setRecipientName('Pablo Miguel de Oliveira Lima');
        setRecipientBank('NU PAGAMENTOS - IP');
        setResolving(false);
    }

    useEffect(() => {
        // quando a chave ficar "válida", tenta resolver mock
        if (pixKey && !keyError) {
            resolveKey();
        } else {
            setRecipientName('');
            setRecipientBank('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixKey, keyError]);

    if (!open) return null;

    return (
        <div
            aria-hidden={false}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[120] flex items-start justify-center p-4"
        >
            {/* overlay */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            />

            {/* card com scroll interno seguro */}
            <div
                className="
          relative z-[121] w-[min(700px,calc(100vw-2rem))]
          rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl
          dark:border-[#1c2533] dark:bg-[#0d1117]
        "
                style={{
                    maxHeight: '85vh',
                    overflowY: 'auto',
                }}
            >
                {/* header */}
                <header className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Transferência via Pix</h3>
                    <button
                        onClick={onClose}
                        className="grid h-8 w-8 place-items-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-white/70 dark:hover:bg-white/10"
                        aria-label="Fechar"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </header>

                {/* conteúdo */}
                <div className="space-y-5">
                    {/* chave */}
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-white/90">
                            Para quem você quer enviar?
                        </label>
                        <p className="mb-2 text-xs text-slate-500 dark:text-white/60">
                            Informe a chave Pix (CPF/CNPJ, telefone, e-mail ou aleatória).
                        </p>
                        <input
                            value={maskedKey}
                            onChange={(e) => {
                                // sempre armazenar o "bruto" para detecção correta
                                const raw = e.target.value;
                                setPixKey(raw);
                            }}
                            placeholder="Digite a chave Pix"
                            className={[
                                'w-full rounded-lg border px-4 py-3 text-sm outline-none transition',
                                'bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus:border-blue-500',
                                'dark:bg-[#0f1520] dark:text-white dark:placeholder:text-white/40 dark:border-[#1c2533] dark:focus:border-blue-500',
                                keyError ? 'border-rose-400 focus:border-rose-500' : '',
                            ].join(' ')}
                        />
                        <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]
                border-slate-300 text-slate-600 dark:border-white/10 dark:text-white/70">
                <BadgeHelp className="h-3 w-3" />
                  {keyType === 'unknown' ? 'Tipo: —' : `Tipo: ${keyType.toUpperCase()}`}
              </span>
                            {keyError ? (
                                <span className="inline-flex items-center gap-1 text-rose-500">
                  <CircleAlert className="h-3.5 w-3.5" /> {keyError}
                </span>
                            ) : null}
                        </div>
                    </div>

                    {/* cartão de confirmação (destinatário/banco) */}
                    {(recipientName || recipientBank) && (
                        <div
                            className="
                rounded-lg border p-4
                border-emerald-500/25 bg-emerald-600/10
                dark:border-emerald-400/20 dark:bg-emerald-500/10
              "
                        >
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-white/90">
                    <User2 className="h-4 w-4" />
                    Destinatário
                  </span>
                                    <span className="text-sm text-slate-900 dark:text-white">
                    {resolving ? 'Validando…' : (recipientName || '—')}
                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-white/90">
                    <Building2 className="h-4 w-4" />
                    Banco
                  </span>
                                    <span className="text-sm text-slate-900 dark:text-white">
                    {resolving ? '—' : (recipientBank || '—')}
                  </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* valor */}
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
                                onChange={(e) => handleAmountInput(e.target.value)}
                                inputMode="numeric"
                                placeholder="0,00"
                                className="
                  w-full rounded-lg border pl-9 pr-3 py-3 text-sm outline-none transition
                  bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus:border-blue-500
                  dark:bg-[#0f1520] dark:text-white dark:placeholder:text-white/40 dark:border-[#1c2533] dark:focus:border-blue-500
                "
                            />
                        </div>
                    </div>

                    {/* mensagem */}
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
                            className="
                w-full rounded-lg border px-4 py-3 text-sm outline-none transition
                bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus:border-blue-500
                dark:bg-[#0f1520] dark:text-white dark:placeholder:text-white/40 dark:border-[#1c2533] dark:focus:border-blue-500
              "
                        />
                    </div>

                    {/* resumo + confirmar */}
                    <div className="rounded-lg border border-slate-200 p-4 dark:border-[#1c2533]">
                        <div className="mb-2 flex items-center gap-2 text-slate-600 dark:text-white/70">
                            <Landmark className="h-4 w-4" />
                            <span className="text-sm">Resumo</span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <Row k="Chave" v={maskedKey || '—'} />
                            <Row k="Destinatário" v={recipientName || '—'} />
                            <Row k="Instituição" v={recipientBank || '—'} />
                            <Row k="Valor" v={amount ? formatBRL(numericAmount) : '—'} strong />
                            {message ? <Row k="Mensagem" v={message} /> : null}
                        </div>

                        <button
                            type="button"
                            disabled={!canConfirm}
                            onClick={() => {
                                // aqui você chamaria sua API
                                // mock: apenas fecha
                                onClose();
                            }}
                            className="
                mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg
                bg-blue-600 px-5 text-sm font-semibold text-white shadow
                hover:bg-blue-500 active:scale-[.98]
                disabled:cursor-not-allowed disabled:opacity-60
              "
                        >
                            <BadgeCheck className="h-4 w-4" />
                            Confirmar transferência
                        </button>

                        <p className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-white/50">
                            <Shield className="h-3.5 w-3.5" /> Segurança 4Pay habilitada
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/** linha de resumo */
function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-white/70">{k}</span>
            <span className={strong ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-800 dark:text-white/85'}>
        {v}
      </span>
        </div>
    );
}
