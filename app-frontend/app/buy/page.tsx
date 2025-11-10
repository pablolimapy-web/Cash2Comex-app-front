'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { ArrowLeftRight, ChevronDown } from 'lucide-react';
import ModalSelect, { SelectItem } from '@/components/common/ModalSelect';
import TokenLogo from '@/components/crypto/TokenLogo';
import NetworkLogo from '@/components/crypto/NetworkLogo';
import { TOKENS_BY_NETWORK } from '@/app/buy/data/tokens';
import { NETWORKS } from '@/app/buy/data/networks';
import { getQuote } from '@/lib/quotes';


/* ----------------- helpers ----------------- */
function parseBRL(v: string) {
    return Number(String(v).replace(',', '.')) || 0;
}
function toBRL(n: number) {
    return (n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ----------------- page ----------------- */
export default function ComprarPage({
                                        searchParams,
                                    }: {
    searchParams?: { mode?: 'buy' | 'sell' };
}) {
    // modo inicial (?mode=sell)
    const initialMode = (searchParams?.mode === 'sell' ? 'sell' : 'buy') as 'buy' | 'sell';
    const [mode, setMode] = useState<'buy' | 'sell'>(initialMode);

    const [networkId, setNetworkId] = useState<string>('arbitrum');
    const [paySymbol, setPaySymbol] = useState<string>('BRL');
    const [rcvSymbol, setRcvSymbol] = useState<string>('ETH');
    const [amountFiat, setAmountFiat] = useState<string>('');
    const [amountCrypto, setAmountCrypto] = useState<string>('');

    const currentNet = useMemo(() => NETWORKS.find((n) => n.id === networkId), [networkId]);
    const availableTokens = useMemo(() => TOKENS_BY_NETWORK[networkId] ?? [], [networkId]);

    // garante tokens válidos quando rede/mode mudam
    useEffect(() => {
        const hasRcv = availableTokens.some((t) => t.symbol === rcvSymbol);
        const hasPay = availableTokens.some((t) => t.symbol === paySymbol);

        if (mode === 'buy') {
            if (!hasRcv) setRcvSymbol(availableTokens[0]?.symbol ?? 'ETH');
            setPaySymbol('BRL');
        } else {
            if (!hasPay || paySymbol === 'BRL') setPaySymbol(availableTokens[0]?.symbol ?? 'ETH');
            setRcvSymbol('BRL');
        }
    }, [networkId, mode, availableTokens]); // eslint-disable-line react-hooks/exhaustive-deps

    const currentToken =
        (mode === 'buy'
            ? availableTokens.find((t) => t.symbol === rcvSymbol)
            : availableTokens.find((t) => t.symbol === paySymbol)) ?? null;

    // itens dos modais
    const networkItems: SelectItem[] = NETWORKS.map((n) => ({
        id: n.id,
        title: n.name,
        subtitle: n.evm ? undefined : 'Não EVM',
        icon: n.icon,
        badge: n.tag,
    }));

    const tokenItems: SelectItem[] = availableTokens.map((t) => ({
        id: t.symbol,
        title: t.symbol,
        subtitle: currentNet?.name ?? '',
        icon: `/assets/icons/tokens/${t.symbol.toLowerCase()}.svg`,
        renderIcon: <TokenLogo symbol={t.symbol} size={20} />,
    }));

    // cotação (mock)
    const fiat = parseBRL(amountFiat);
    const cryptoIn = Number(amountCrypto) || 0;
    const quote = useMemo(
        () =>
            getQuote({
                side: mode,
                network: currentNet?.name ?? 'Arbitrum',
                crypto: mode === 'buy' ? rcvSymbol : paySymbol,
                fiat: 'BRL',
                amountFiat: mode === 'buy' ? fiat : undefined,
                amountCrypto: mode === 'sell' ? cryptoIn : undefined,
            }),
        [mode, currentNet?.name, rcvSymbol, paySymbol, fiat, cryptoIn]
    );

    // troca de modo (preserva valores)
    const switchMode = useCallback(
        (to: 'buy' | 'sell') => {
            if (to === mode) return;
            const fiatNow = parseBRL(amountFiat);
            const cryptoNow = Number(amountCrypto) || 0;
            const rate = quote.rate || 0;

            if (to === 'buy') {
                setMode('buy');
                setPaySymbol('BRL');
                const fallback = availableTokens[0]?.symbol ?? 'ETH';
                setRcvSymbol((prev) => (availableTokens.some((t) => t.symbol === prev) ? prev : fallback));
                const brlEquiv = quote.outFiat ?? cryptoNow * rate;
                setAmountFiat(brlEquiv ? toBRL(brlEquiv) : '');
                setAmountCrypto('');
            } else {
                setMode('sell');
                const fallback = availableTokens[0]?.symbol ?? 'ETH';
                setPaySymbol((prev) =>
                    prev !== 'BRL' && availableTokens.some((t) => t.symbol === prev) ? prev : fallback
                );
                setRcvSymbol('BRL');
                const cryptoEquiv = quote.outCrypto ?? (rate ? fiatNow / rate : 0);
                setAmountCrypto(cryptoEquiv ? cryptoEquiv.toFixed(6) : '');
                setAmountFiat('');
            }
        },
        [mode, amountFiat, amountCrypto, quote.rate, quote.outFiat, quote.outCrypto, availableTokens]
    );

    // inverter ↔ (preserva valores)
    const swapSides = useCallback(() => {
        const fiatNow = parseBRL(amountFiat);
        const cryptoNow = Number(amountCrypto) || 0;
        const rate = quote.rate || 0;

        if (mode === 'buy') {
            setMode('sell');
            setPaySymbol(rcvSymbol);
            setRcvSymbol('BRL');
            const cryptoEquiv = quote.outCrypto ?? (rate ? fiatNow / rate : 0);
            setAmountCrypto(cryptoEquiv ? cryptoEquiv.toFixed(6) : '');
            setAmountFiat('');
        } else {
            setMode('buy');
            setRcvSymbol(paySymbol);
            setPaySymbol('BRL');
            const brlEquiv = quote.outFiat ?? cryptoNow * rate;
            setAmountFiat(brlEquiv ? toBRL(brlEquiv) : '');
            setAmountCrypto('');
        }
    }, [mode, paySymbol, rcvSymbol, amountFiat, amountCrypto, quote]);

    // modais
    const [openNetwork, setOpenNetwork] = useState(false);
    const [openToken, setOpenToken] = useState(false);

    return (
        <>
            {/* Background animado (tema-aware) */}
            <div className="c2c-bg">
                <div className="c2c-grid" />
                {/* três coins, em posições distintas */}
                <div className="c2c-coin" style={{ '--x': '14%', '--y': '26%' } as React.CSSProperties} />
                <div className="c2c-coin b" style={{ '--x': '86%', '--y': '36%' } as React.CSSProperties} />
                <div className="c2c-coin c" style={{ '--x': '74%', '--y': '80%' } as React.CSSProperties} />
                <div className="c2c-grain" />
            </div>

            {/* conteúdo */}
            <div className="relative z-10 mx-auto max-w-[720px] px-4 py-10">
            {/* toggle comprar/vender */}
                <div className="mb-6 flex items-center justify-center">
                    <div className="flex gap-2 rounded-full border p-1 border-slate-300 bg-slate-100 dark:border-white/10 dark:bg-white/5">
                        <button
                            onClick={() => switchMode('buy')}
                            className={`rounded-full px-4 py-1 text-sm transition ${
                                mode === 'buy'
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-black'
                                    : 'text-slate-700 hover:text-slate-900 dark:text-white/70 dark:hover:text-white'
                            }`}
                        >
                            Comprar
                        </button>
                        <button
                            onClick={() => switchMode('sell')}
                            className={`rounded-full px-4 py-1 text-sm transition ${
                                mode === 'sell'
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-black'
                                    : 'text-slate-700 hover:text-slate-900 dark:text-white/70 dark:hover:text-white'
                            }`}
                        >
                            Vender
                        </button>
                    </div>
                </div>

                {/* card principal */}
                <div className="rounded-3xl border border-slate-300 bg-slate-100 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] md:p-6">
                    {/* Rede */}
                    <div className="mb-4 rounded-2xl border border-slate-300 bg-slate-200/60 p-4 dark:border-white/10 dark:bg-white/[0.035]">
                        <div className="text-xs text-slate-600 dark:text-white/60">Receber na rede</div>
                        <button
                            onClick={() => setOpenNetwork(true)}
                            className="mt-2 flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-800 hover:bg-slate-50 dark:border-white/10 dark:bg-black/20 dark:text-white/90"
                        >
              <span className="flex items-center gap-2">
                <NetworkLogo id={networkId} size={20} />
                <span>{currentNet?.name ?? 'Arbitrum'}</span>
              </span>
                            <ChevronDown size={18} className="opacity-60" />
                        </button>
                    </div>

                    {/* inputs */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
                        {/* pagar */}
                        <div className="rounded-2xl border border-slate-300 bg-slate-200/60 p-4 dark:border-white/10 dark:bg-white/[0.035]">
                            <div className="text-xs text-slate-600 dark:text-white/60">
                                {mode === 'buy' ? 'Pagar com (BRL)' : 'Pagar com'}
                            </div>

                            {mode === 'sell' && (
                                <button
                                    onClick={() => setOpenToken(true)}
                                    className="mt-2 flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-800 hover:bg-slate-50 dark:border-white/10 dark:bg-black/20 dark:text-white/90"
                                >
                  <span className="flex items-center gap-2">
                    <TokenLogo symbol={paySymbol} size={18} />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {paySymbol}
                          <span className="text-slate-500 dark:text-white/60"> — {currentToken?.name ?? ''}</span>
                      </span>
                        {currentNet && (
                            <span className="text-xs text-slate-500 dark:text-white/45">{currentNet.name}</span>
                        )}
                    </div>
                  </span>
                                    <ChevronDown size={18} className="opacity-60" />
                                </button>
                            )}

                            <div className="mt-3">
                                <input
                                    inputMode="decimal"
                                    placeholder={mode === 'buy' ? '0,00' : '0,000000'}
                                    value={mode === 'buy' ? amountFiat : amountCrypto}
                                    onChange={(e) => (mode === 'buy' ? setAmountFiat(e.target.value) : setAmountCrypto(e.target.value))}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 dark:border-white/10 dark:bg-black/20 dark:text-white/90 dark:placeholder:text-white/40 dark:focus:border-white/25"
                                />
                            </div>
                        </div>

                        {/* seta trocar */}
                        <div className="order-last col-span-1 grid place-content-center md:order-none md:col-span-2 md:-my-2">
                            <button
                                onClick={swapSides}
                                className="group grid place-content-center rounded-full border border-slate-300 bg-slate-200 p-2 hover:bg-slate-300 dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-white/30"
                            >
                                <ArrowLeftRight
                                    size={18}
                                    className="text-slate-700 group-hover:text-slate-900 dark:text-white/80 dark:group-hover:text-white"
                                />
                            </button>
                        </div>

                        {/* receber */}
                        <div className="rounded-2xl border border-slate-300 bg-slate-200/60 p-4 dark:border-white/10 dark:bg-white/[0.035]">
                            <div className="text-xs text-slate-600 dark:text-white/60">
                                {mode === 'buy' ? 'Receber' : 'Receber (BRL)'}
                            </div>

                            {mode === 'buy' && (
                                <button
                                    onClick={() => setOpenToken(true)}
                                    className="mt-2 flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-800 hover:bg-slate-50 dark:border-white/10 dark:bg-black/20 dark:text-white/90"
                                >
                  <span className="flex items-center gap-2">
                    <TokenLogo symbol={rcvSymbol} size={18} />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {rcvSymbol}
                          <span className="text-slate-500 dark:text-white/60"> — {currentToken?.name ?? ''}</span>
                      </span>
                        {currentNet && (
                            <span className="text-xs text-slate-500 dark:text-white/45">{currentNet.name}</span>
                        )}
                    </div>
                  </span>
                                    <ChevronDown size={18} className="opacity-60" />
                                </button>
                            )}

                            <div className="mt-3">
                                <input
                                    readOnly
                                    value={mode === 'buy' ? (quote.outCrypto ?? 0).toFixed(6) : toBRL(quote.outFiat ?? 0)}
                                    className="w-full cursor-not-allowed rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-white/60"
                                />
                            </div>
                        </div>
                    </div>

                    {/* resumo */}
                    <div className="mt-4 rounded-2xl border border-slate-300 bg-slate-200/70 p-4 text-sm dark:border-white/10 dark:bg-white/[0.035]">
                        <div className="flex items-center justify-between text-slate-700 dark:text-white/70">
                            <span>Taxa de processamento</span>
                            <span>{Math.round((quote.feePct || 0) * 100)}%</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-slate-900 dark:text-white">
                            <span>Valor aproximado final</span>
                            <span>
                {mode === 'buy'
                    ? `${(quote.outCrypto ?? 0).toFixed(6)} ${rcvSymbol}`
                    : `R$ ${toBRL(quote.outFiat ?? 0)}`}
              </span>
                        </div>
                    </div>

                    <button
                        disabled={mode === 'buy' ? !parseBRL(amountFiat) : !(Number(amountCrypto) || 0)}
                        className="mt-4 w-full rounded-2xl border border-emerald-300 bg-emerald-200 px-4 py-4 text-sm font-medium text-emerald-900 transition hover:bg-emerald-300 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-200 dark:hover:bg-emerald-400/20 disabled:opacity-40"
                    >
                        {mode === 'buy' ? `Comprar ${rcvSymbol}` : `Vender ${paySymbol}`}
                    </button>

                    <div className="mt-2 text-[10px] text-slate-500 dark:text-white/40">
                        ** Cotação mock para desenvolvimento. Valores podem variar.
                    </div>
                </div>

                {/* Modais */}
                <ModalSelect
                    open={openNetwork}
                    onClose={() => setOpenNetwork(false)}
                    title="Escolha uma rede"
                    placeholder="Pesquisar rede"
                    items={networkItems}
                    selectedId={networkId}
                    onSelect={(id) => setNetworkId(id)}
                />

                <ModalSelect
                    open={openToken}
                    onClose={() => setOpenToken(false)}
                    title="Escolha uma moeda"
                    placeholder="Pesquisar moeda"
                    items={tokenItems}
                    selectedId={mode === 'buy' ? rcvSymbol : paySymbol}
                    onSelect={(sym) => {
                        if (mode === 'buy') setRcvSymbol(sym);
                        else setPaySymbol(sym);
                    }}
                />
            </div>
        </>
    );
}
