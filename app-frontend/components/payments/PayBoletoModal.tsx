'use client';

import { useEffect, useMemo, useState } from 'react';
import { X, Coins, Wallet, Network, Shield } from 'lucide-react';

export type DecodedBoleto = {
    amountBRL: number;      // em centavos
    dueDate?: string;       // ISO
    bank?: string;
    displayName?: string;   // nome fantasia
    fine?: number;          // centavos
    interest?: number;      // centavos
    payerName?: string;
};

type Tab = 'saldo' | 'crypto';

export default function PayBoletoModal({
                                           open,
                                           onClose,
                                           prefill,
                                       }: {
    open: boolean;
    onClose: () => void;
    prefill?: DecodedBoleto;
}) {
    const [tab, setTab] = useState<Tab>('saldo');

    // boleto code + mock decode
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [decoded, setDecoded] = useState<DecodedBoleto>({
        amountBRL: 0,
        dueDate: new Date().toISOString().slice(0, 10),
        bank: 'Não definido',
        displayName: 'Não identificado',
        fine: 0,
        interest: 0,
        payerName: 'Não identificado',
    });

    // crypto tab state
    const [network, setNetwork] = useState<'Polygon' | 'BSC' | 'TRON'>('Polygon');
    const [token, setToken] = useState<'USDT' | 'USDC'>('USDT');
    const [wallet, setWallet] = useState('');

    // reset ao fechar
    useEffect(() => {
        if (!open) {
            setTab('saldo');
            setCode('');
            setDescription('');
            setNetwork('Polygon');
            setToken('USDT');
            setWallet('');
            setDecoded({
                amountBRL: 0,
                dueDate: new Date().toISOString().slice(0, 10),
                bank: 'Não definido',
                displayName: 'Não identificado',
                fine: 0,
                interest: 0,
                payerName: 'Não identificado',
            });
        }
    }, [open]);

    // prefill vindo da tabela
    useEffect(() => {
        if (open && prefill) setDecoded((d) => ({ ...d, ...prefill }));
    }, [open, prefill]);

    // mock de decodificação sempre que o código mudar
    useEffect(() => {
        if (code.trim().length >= 6) {
            const cents = Math.min(code.trim().length * 123, 99999);
            setDecoded((d) => ({
                ...d,
                amountBRL: cents,
                bank: 'Banco Exemplo',
                dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
            }));
        }
    }, [code]);

    // trava scroll do body com modal aberto
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    const amountBRL = useMemo(
        () =>
            new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(
                (decoded.amountBRL + (decoded.fine ?? 0) + (decoded.interest ?? 0)) /
                100
            ),
        [decoded]
    );

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-start justify-center p-4 overflow-y-auto">
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* caixa do modal: agora com max-height e rolagem */}
            <div
                className="
          relative z-[111] w-[min(720px,calc(100vw-2rem))]
          rounded-2xl border border-slate-200 bg-white shadow-2xl
          dark:border-[#1c2533] dark:bg-[#0d1117]
          max-h-[85vh] overflow-y-auto overscroll-contain
        "
            >
                {/* padding interno para não “comer” a rolagem */}
                <div className="p-5">
                    {/* Header */}
                    <header className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Pagamento de boleto
                        </h3>
                        <button
                            onClick={onClose}
                            className="grid h-8 w-8 place-items-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-white/70 dark:hover:bg-white/10"
                            aria-label="Fechar"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </header>

                    {/* Tabs */}
                    <div className="mb-4 flex gap-2">
                        <button
                            onClick={() => setTab('saldo')}
                            className={[
                                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold',
                                tab === 'saldo'
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                    : 'border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-[#1f2a36] dark:text-white/80 dark:hover:bg-[#19212e]',
                            ].join(' ')}
                        >
                            <Wallet size={16} /> Saldo da conta
                        </button>

                        <button
                            onClick={() => setTab('crypto')}
                            className={[
                                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold',
                                tab === 'crypto'
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                    : 'border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-[#1f2a36] dark:text-white/80 dark:hover:bg-[#19212e]',
                            ].join(' ')}
                        >
                            <Coins size={16} /> Criptomoeda{' '}
                            <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-white/10 dark:text-white/70">
                Beta
              </span>
                        </button>
                    </div>

                    {/* Content */}
                    {tab === 'saldo' ? (
                        <SaldoForm
                            code={code}
                            setCode={setCode}
                            decoded={decoded}
                            description={description}
                            setDescription={setDescription}
                            amountBRL={amountBRL}
                        />
                    ) : (
                        <CryptoForm
                            network={network}
                            setNetwork={setNetwork}
                            token={token}
                            setToken={setToken}
                            wallet={wallet}
                            setWallet={setWallet}
                            code={code}
                            setCode={setCode}
                            decoded={decoded}
                            amountBRL={amountBRL}
                            description={description}
                            setDescription={setDescription}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

/* ---------------- SALDO DA CONTA --------------- */
function SaldoForm({
                       code,
                       setCode,
                       decoded,
                       description,
                       setDescription,
                       amountBRL,
                   }: {
    code: string;
    setCode: (v: string) => void;
    decoded: DecodedBoleto;
    description: string;
    setDescription: (v: string) => void;
    amountBRL: string;
}) {
    return (
        <div className="space-y-5">
            {/* Código */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-white/90">
                    Insira o código do boleto
                </label>
                <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Digitar código"
                    className="form-input dark:bg-[#0f1520]"
                />
            </div>

            {/* Resumo decodificado */}
            <DecodedBlock
                decoded={decoded}
                amountBRL={amountBRL}
                showCryptoExtra={false}
            />

            {/* Descrição */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-white/90">
                    Descrição
                </label>
                <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Adicionar descrição (opcional)"
                    className="form-textarea dark:bg-[#0f1520]"
                />
            </div>

            <button className="mt-1 h-11 w-full rounded-lg bg-lime-500/90 text-sm font-semibold text-slate-900 hover:bg-lime-500">
                Pagar boleto
            </button>
        </div>
    );
}

/* ---------------- CRIPTO --------------- */
function CryptoForm({
                        network,
                        setNetwork,
                        token,
                        setToken,
                        wallet,
                        setWallet,
                        code,
                        setCode,
                        decoded,
                        amountBRL,
                        description,
                        setDescription,
                    }: {
    network: 'Polygon' | 'BSC' | 'TRON';
    setNetwork: (v: 'Polygon' | 'BSC' | 'TRON') => void;
    token: 'USDT' | 'USDC';
    setToken: (v: 'USDT' | 'USDC') => void;
    wallet: string;
    setWallet: (v: string) => void;
    code: string;
    setCode: (v: string) => void;
    decoded: DecodedBoleto;
    amountBRL: string;
    description: string;
    setDescription: (v: string) => void;
}) {
    const rate = 1.0; // mock
    const cryptoFee = 0.03; // 3%
    const usdValue = useMemo(
        () => ((decoded.amountBRL / 100) * (1 + cryptoFee)) / rate || 0,
        [decoded.amountBRL, rate]
    );

    return (
        <div className="space-y-5">
            {/* Rede / Moeda */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-white/90">
                        Rede
                    </label>
                    <div className="relative">
                        <Network className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <select
                            value={network}
                            onChange={(e) => setNetwork(e.target.value as any)}
                            className="form-select pl-9 dark:bg-[#0f1520]"
                        >
                            <option>Polygon</option>
                            <option>BSC</option>
                            <option>TRON</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-white/90">
                        Moeda/Token
                    </label>
                    <select
                        value={token}
                        onChange={(e) => setToken(e.target.value as any)}
                        className="form-select dark:bg-[#0f1520]"
                    >
                        <option>USDT</option>
                        <option>USDC</option>
                    </select>
                </div>
            </div>

            {/* Carteira */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-white/90">
                    Sua carteira
                </label>
                <p className="mb-2 text-xs text-slate-500 dark:text-white/60">
                    Cole o endereço da carteira que enviará o valor a ser convertido.
                </p>
                <input
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    placeholder="Digitar carteira"
                    className="form-input dark:bg-[#0f1520]"
                />
                <button
                    disabled
                    className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 opacity-70 dark:border-[#1f2a36] dark:text-white/70"
                >
                    <Shield size={14} /> Conectar carteira e utilizá-la{' '}
                    <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-white/10 dark:text-white/70">
            Em breve
          </span>
                </button>
            </div>

            {/* Código */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-white/90">
                    Insira o código do boleto
                </label>
                <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Digitar código"
                    className="form-input dark:bg-[#0f1520]"
                />
            </div>

            {/* Resumo + totais em cripto */}
            <DecodedBlock
                decoded={decoded}
                amountBRL={amountBRL}
                showCryptoExtra
            />
            <div className="rounded-lg border border-slate-200 p-3 text-sm dark:border-[#1c2533]">
                <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-white/70">
            Valor total em cripto
          </span>
                    <span className="font-semibold text-white">
            {usdValue.toFixed(2)} {token}
          </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                    <span className="text-slate-600 dark:text-white/70">Tarifa 4Pay</span>
                    <span className="text-white">3%</span>
                </div>
            </div>

            {/* Descrição */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-white/90">
                    Descrição
                </label>
                <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Adicionar descrição (opcional)"
                    className="form-textarea dark:bg-[#0f1520]"
                />
            </div>

            <button className="mt-1 h-11 w-full rounded-lg bg-lime-500/90 text-sm font-semibold text-slate-900 hover:bg-lime-500">
                Pagar boleto
            </button>
        </div>
    );
}

/* ------- bloco de informações do boleto (compartilhado) ------- */
function DecodedBlock({
                          decoded,
                          amountBRL,
                          showCryptoExtra,
                      }: {
    decoded: DecodedBoleto;
    amountBRL: string;
    showCryptoExtra: boolean;
}) {
    return (
        <div className="grid gap-3 rounded-lg border border-slate-200 p-4 text-sm dark:border-[#1c2533]">
            <Row k="Valor do boleto" v={amountBRL} strong />
            {showCryptoExtra && (
                <Row k="Valor total em cripto" v="0.00 USDT" hint="(calculado abaixo)" />
            )}
            <Row
                k="Vencimento"
                v={
                    decoded.dueDate
                        ? new Date(decoded.dueDate).toLocaleDateString('pt-BR')
                        : 'Não identificado'
                }
            />
            <Row k="Data do pagamento" v={new Date().toLocaleDateString('pt-BR')} />
            <Row k="Banco emissor" v={decoded.bank ?? 'Não definido'} />
            <Row k="Nome Fantasia" v={decoded.displayName ?? 'Não identificado'} />
            <Row
                k="Multa"
                v={new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format((decoded.fine ?? 0) / 100)}
            />
            <Row
                k="Juros"
                v={new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format((decoded.interest ?? 0) / 100)}
            />
            <Row k="Nome do pagador" v={decoded.payerName ?? 'Não identificado'} />
        </div>
    );
}

function Row({
                 k,
                 v,
                 strong,
                 hint,
             }: {
    k: string;
    v: string;
    strong?: boolean;
    hint?: string;
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-white/70">{k}</span>
            <span className={strong ? 'font-semibold text-white' : 'text-white'}>
        {v} {hint ? <em className="text-white/50">{hint}</em> : null}
      </span>
        </div>
    );
}
