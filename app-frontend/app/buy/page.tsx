'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { ArrowLeftRight, ChevronDown } from 'lucide-react';
import ModalSelect, { SelectItem } from '@/components/common/ModalSelect';
import TokenLogo from '@/components/crypto/TokenLogo';
import NetworkLogo from '@/components/crypto/NetworkLogo';
import { TOKENS_BY_NETWORK } from '@/app/buy/data/tokens';
import { NETWORKS } from '@/app/buy/data/networks';
import { getQuote } from '@/lib/quotes';
import { useLivePriceBRL } from '@/lib/useLivePrice';

/* ----------------- helpers ----------------- */
function parseBRL(v: string) {
    return Number(String(v).replace(',', '.')) || 0;
}
function toBRL(n: number) {
    return (n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


export default function ComprarPage({ searchParams }: { searchParams?: { mode?: 'buy' | 'sell' } }) {
    const initialMode = (searchParams?.mode === 'sell' ? 'sell' : 'buy') as 'buy' | 'sell';
    const [mode, setMode] = useState<'buy' | 'sell'>(initialMode);

    const [networkId, setNetworkId] = useState<string>('arbitrum');

    const [paySymbol, setPaySymbol] = useState<string>('BRL');
    const [rcvSymbol, setRcvSymbol] = useState<string>('ETH');

    const [amountFiat, setAmountFiat] = useState<string>('');
    const [amountCrypto, setAmountCrypto] = useState<string>('');

    const currentNet = useMemo(() => NETWORKS.find((n) => n.id === networkId), [networkId]);
    const availableTokens = useMemo(() => TOKENS_BY_NETWORK[networkId] ?? [], [networkId]);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [networkId, availableTokens]);

    const currentToken =
        (mode === 'buy'
            ? availableTokens.find((t) => t.symbol === rcvSymbol)
            : availableTokens.find((t) => t.symbol === paySymbol)) ?? null;

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

    /* ----------------- preço em tempo real ----------------- */
    const activeSymbol = (mode === 'buy' ? rcvSymbol : paySymbol).toUpperCase();
    const { priceBRLBySymbol } = useLivePriceBRL([activeSymbol]);
    const livePriceBRL = priceBRLBySymbol[activeSymbol]; // number | undefined

    const fiat = parseBRL(amountFiat);
    const cryptoIn = Number(amountCrypto) || 0;
    const quote = useMemo(() => {
        const base = getQuote({
            side: mode,
            network: currentNet?.name ?? 'Arbitrum',
            crypto: mode === 'buy' ? rcvSymbol : paySymbol,
            fiat: 'BRL',
            amountFiat: mode === 'buy' ? fiat : undefined,
            amountCrypto: mode === 'sell' ? cryptoIn : undefined,
        });

        if (typeof livePriceBRL !== 'number' || livePriceBRL <= 0) return base;

        const feePct = base.feePct ?? 0;
        const feeFixed = base.feeFixed ?? 0;

        let outCrypto = base.outCrypto ?? 0;
        let outFiat = base.outFiat ?? 0;

        if (mode === 'buy') {
            const grossCrypto = (fiat || 0) / livePriceBRL;
            const fees = grossCrypto * feePct + feeFixed / livePriceBRL;
            outCrypto = Math.max(grossCrypto - fees, 0);
            outFiat = fiat || 0;
        } else {
            const grossFiat = (cryptoIn || 0) * livePriceBRL;
            const fees = grossFiat * feePct + feeFixed;
            outFiat = Math.max(grossFiat - fees, 0);
            outCrypto = cryptoIn || 0;
        }

        return { ...base, rate: livePriceBRL, outCrypto, outFiat };
    }, [mode, currentNet?.name, rcvSymbol, paySymbol, fiat, cryptoIn, livePriceBRL]);

    const switchMode = useCallback(
        (to: 'buy' | 'sell') => {
            if (to === mode) return;
            const fiatNow = parseBRL(amountFiat);
            const cryptoNow = Number(amountCrypto) || 0;
            const rate = quote.rate || livePriceBRL || 0;

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
                setPaySymbol((prev) => (prev !== 'BRL' && availableTokens.some((t) => t.symbol === prev) ? prev : fallback));
                setRcvSymbol('BRL');
                const cryptoEquiv = quote.outCrypto ?? (rate ? fiatNow / rate : 0);
                setAmountCrypto(cryptoEquiv ? cryptoEquiv.toFixed(6) : '');
                setAmountFiat('');
            }
        },
        [mode, amountFiat, amountCrypto, quote.outFiat, quote.outCrypto, quote.rate, livePriceBRL, availableTokens]
    );

    // inverter ↔
    const swapSides = useCallback(() => {
        const fiatNow = parseBRL(amountFiat);
        const cryptoNow = Number(amountCrypto) || 0;
        const rate = quote.rate || livePriceBRL || 0;

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
    }, [mode, paySymbol, rcvSymbol, amountFiat, amountCrypto, quote.outFiat, quote.outCrypto, quote.rate, livePriceBRL]);

    /* ---------- MODAIS ---------- */
    const [openNetwork, setOpenNetwork] = useState(false);
    const [openToken, setOpenToken] = useState(false);

    /* ---------- RENDER ---------- */
    return (
        <div className="mx-auto max-w-[720px] px-4 py-10">
            {/* Toggle Comprar/Vender */}
            <div className="mb-6 flex items-center justify-center">
                <div className="flex gap-2 rounded-full border border-white/10 bg-white p-1">
                    <button
                        onClick={() => switchMode('buy')}
                        className={`rounded-full px-4 py-1 text-sm transition ${
                            mode === 'buy' ? 'bg-black text-white' : 'text-black/70 hover:text-black'
                        }`}
                    >
                        Comprar
                    </button>
                    <button
                        onClick={() => switchMode('sell')}
                        className={`rounded-full px-4 py-1 text-sm transition ${
                            mode === 'sell' ? 'bg-black text-white' : 'text-black/70 hover:text-black'
                        }`}
                    >
                        Vender
                    </button>
                </div>
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
                {/* Rede */}
                <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <div className="text-xs text-white/60">Receber na rede</div>
                    <button
                        onClick={() => setOpenNetwork(true)}
                        className="mt-2 flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-white/90"
                    >
            <span className="flex items-center gap-2">
              <NetworkLogo id={networkId} size={20} />
              <span>{currentNet?.name ?? 'Arbitrum'}</span>
            </span>
                        <ChevronDown size={18} className="opacity-60" />
                    </button>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
                    {/* Pagar com */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                        <div className="text-xs text-white/60">{mode === 'buy' ? 'Pagar com (BRL)' : 'Pagar com'}</div>

                        {mode === 'sell' && (
                            <button
                                onClick={() => setOpenToken(true)}
                                className="mt-2 flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-white/90"
                            >
                <span className="flex items-center gap-2">
                  <TokenLogo symbol={paySymbol} size={18} />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {paySymbol}
                        <span className="text-white/60"> — {currentToken?.name ?? ''}</span>
                    </span>
                      {currentNet && <span className="text-xs text-white/45">{currentNet.name}</span>}
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
                                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-lg text-white/90 outline-none focus:border-white/25"
                            />
                        </div>
                    </div>

                    {/* Botão de troca */}
                    <div className="order-last col-span-1 grid place-content-center md:order-none md:col-span-2 md:-my-2">
                        <button
                            onClick={swapSides}
                            className="group grid place-content-center rounded-full border border-white/10 bg-white/[0.06] p-2 hover:border-white/30"
                        >
                            <ArrowLeftRight size={18} className="text-white/80 group-hover:text-white" />
                        </button>
                    </div>

                    {/* Receber */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                        <div className="text-xs text-white/60">{mode === 'buy' ? 'Receber' : 'Receber (BRL)'}</div>

                        {mode === 'buy' && (
                            <button
                                onClick={() => setOpenToken(true)}
                                className="mt-2 flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-white/90"
                            >
                <span className="flex items-center gap-2">
                  <TokenLogo symbol={rcvSymbol} size={18} />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {rcvSymbol}
                        <span className="text-white/60"> — {currentToken?.name ?? ''}</span>
                    </span>
                      {currentNet && <span className="text-xs text-white/45">{currentNet.name}</span>}
                  </div>
                </span>
                                <ChevronDown size={18} className="opacity-60" />
                            </button>
                        )}

                        <div className="mt-3">
                            <input
                                readOnly
                                value={mode === 'buy' ? (quote.outCrypto ?? 0).toFixed(6) : toBRL(quote.outFiat ?? 0)}
                                className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-lg text-white/60"
                            />
                        </div>
                    </div>
                </div>

                {/* Resumo */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm">
                    <div className="flex items-center justify-between text-white/70">
                        <span>Taxa de processamento</span>
                        <span>{Math.round((quote.feePct || 0) * 100)}%</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-white">
                        <span>Valor aproximado final</span>
                        <span>
              {mode === 'buy' ? `${(quote.outCrypto ?? 0).toFixed(6)} ${rcvSymbol}` : `R$ ${toBRL(quote.outFiat ?? 0)}`}
            </span>
                    </div>
                </div>

                <button
                    disabled={mode === 'buy' ? !parseBRL(amountFiat) : !(Number(amountCrypto) || 0)}
                    className="mt-4 w-full rounded-2xl border border-emerald-500/40 bg-emerald-500/20 px-4 py-4 text-emerald-200 hover:border-emerald-400/70 hover:bg-emerald-400/20 disabled:opacity-40"
                >
                    {mode === 'buy' ? `Comprar ${rcvSymbol}` : `Vender ${paySymbol}`}
                </button>

                <div className="mt-2 text-[10px] text-white/40">
                    ** Cotação live (CoinGecko) com taxas mock para desenvolvimento.
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
    );
}
