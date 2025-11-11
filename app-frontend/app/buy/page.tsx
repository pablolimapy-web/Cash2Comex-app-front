'use client';

import * as React from 'react';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { ArrowLeft, ArrowLeftRight, ChevronDown, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import ModalSelect, { SelectItem } from '@/components/common/ModalSelect';
import TokenLogo from '@/components/crypto/TokenLogo';
import NetworkLogo from '@/components/crypto/NetworkLogo';
import { TOKENS_BY_NETWORK } from '@/app/buy/data/tokens';
import { NETWORKS } from '@/app/buy/data/networks';
import { useQuote } from '@/lib/useQuote';

/* ---------- helpers ---------- */
const unmaskBRL = (v: string) => Number(v.replace(/\./g, '').replace(',', '.')) || 0;
const maskBRLFromDigits = (digits: string) => {
    if (!digits) return '';
    const cents = parseInt(digits, 10);
    const val = (isFinite(cents) ? cents : 0) / 100;
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
const parseBRL = (v: string) => unmaskBRL(v);
const toBRL = (n: number) => (n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const clamp = (n: number, m = 0) => (isFinite(n) ? Math.max(n, m) : 0);

/* ---------- animações ---------- */
const fade = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.2 } } };
const scale = { hidden: { opacity: 0, scale: 0.985 }, show: { opacity: 1, scale: 1, transition: { duration: 0.26 } } };
const list = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } } };

/* ---------- constantes ---------- */
const MIN_BRL = 250;
const BASE_FEE = 0.03; // 3%

/* ---------- page ---------- */
export default function ComprarPage({ searchParams }: { searchParams?: { mode?: 'buy' | 'sell' } }) {
    const router = useRouter();
    const initialMode = (searchParams?.mode === 'sell' ? 'sell' : 'buy') as 'buy' | 'sell';

    const [mode, setMode] = useState<'buy' | 'sell'>(initialMode);
    const [networkId, setNetworkId] = useState('arbitrum');
    const [paySymbol, setPaySymbol] = useState('BRL');
    const [rcvSymbol, setRcvSymbol] = useState('ETH');

    const [amountFiat, setAmountFiat] = useState('');     // BRL (mascarado)
    const [amountCrypto, setAmountCrypto] = useState(''); // SELL

    // ---- cupom (mock via API) ----
    const [coupon, setCoupon] = useState('');
    const [couponData, setCouponData] = useState<null | { code: string; discountPct: number; minAmountBRL?: number; expiresAt?: string }>(null);
    const [couponStatus, setCouponStatus] = useState<'idle'|'loading'|'ok'|'invalid'|'expired'>('idle');
    const [couponErr, setCouponErr] = useState<string | null>(null);

    const clearCoupon = () => {
        setCouponData(null);
        setCouponStatus('idle');
        setCouponErr(null);
    };

    // valida cupom com debounce (600ms)
    useEffect(() => {
        if (!coupon.trim()) { clearCoupon(); return; }

        const code = coupon.trim().toUpperCase();
        setCouponStatus('loading'); setCouponErr(null);

        const t = setTimeout(async () => {
            try {
                const res = await fetch(`/api/coupons/${encodeURIComponent(code)}`);
                const body = await res.json().catch(() => ({}));
                if (!res.ok) {
                    if (body?.reason === 'expired') {
                        setCouponStatus('expired');
                        setCouponData(body.coupon ?? null);
                        setCouponErr('Cupom expirado');
                    } else {
                        setCouponStatus('invalid');
                        setCouponData(null);
                        setCouponErr('Cupom inválido');
                    }
                    return;
                }
                setCouponData(body.coupon);
                setCouponStatus('ok');
                setCouponErr(null);
            } catch {
                setCouponStatus('invalid');
                setCouponData(null);
                setCouponErr('Erro ao validar cupom');
            }
        }, 600);

        return () => clearTimeout(t);
    }, [coupon]);

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
    }, [mode, networkId, availableTokens]);

    const currentToken =
        (mode === 'buy'
            ? availableTokens.find((t) => t.symbol === rcvSymbol)
            : availableTokens.find((t) => t.symbol === paySymbol)) ?? null;

    const networksItems: SelectItem[] = NETWORKS.map((n) => ({
        id: n.id,
        title: n.name,
        subtitle: n.evm ? undefined : 'Não EVM',
        icon: n.icon,
        badge: n.tag,
        renderIcon: <NetworkLogo id={n.id} size={18} />,
    }));
    const tokenItems: SelectItem[] = availableTokens.map((t) => ({
        id: t.symbol,
        title: t.symbol,
        subtitle: currentNet?.name ?? '',
        icon: `/assets/icons/tokens/${t.symbol.toLowerCase()}.svg`,
        renderIcon: <TokenLogo symbol={t.symbol} size={20} />,
    }));

    // taxa efetiva (aplica cupom se válido e se cumprir o mínimo quando for BUY)
    const fiat = clamp(parseBRL(amountFiat));
    const meetsMin = couponData?.minAmountBRL ? fiat >= (couponData.minAmountBRL ?? 0) : true;
    const couponPct = couponStatus === 'ok' && (mode === 'sell' || meetsMin) ? (couponData?.discountPct ?? 0) : 0;
    const effectiveFee = Math.max(BASE_FEE * (1 - couponPct), 0);

    // >>> cotação ao vivo
    const cryptoIn = Number(amountCrypto) || 0;
    const { rate, outCrypto, outFiat, loading, error } = useQuote({
        side: mode,
        crypto: mode === 'buy' ? rcvSymbol : paySymbol,
        fiat: 'BRL',
        amountFiat: mode === 'buy' ? fiat : undefined,
        amountCrypto: mode === 'sell' ? cryptoIn : undefined,
        feePct: effectiveFee,            // 👈 taxa com cupom
        networkId,
    });

    // handlers
    const handleFiatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const masked = maskBRLFromDigits(e.target.value.replace(/\D/g, ''));
        setAmountFiat(masked);
    };

    const switchMode = useCallback(
        (to: 'buy' | 'sell') => {
            if (to === mode) return;
            if (to === 'buy') {
                setMode('buy');
                setPaySymbol('BRL');
                const fb = availableTokens[0]?.symbol ?? 'ETH';
                setRcvSymbol((prev) => (availableTokens.some((t) => t.symbol === prev) ? prev : fb));
                const brl = (Number(amountCrypto) || 0) * (rate || 0);
                setAmountFiat(brl ? toBRL(brl) : '');
                setAmountCrypto('');
            } else {
                setMode('sell');
                const fb = availableTokens[0]?.symbol ?? 'ETH';
                setPaySymbol((prev) => (prev !== 'BRL' && availableTokens.some((t) => t.symbol === prev) ? prev : fb));
                setRcvSymbol('BRL');
                const cr = rate ? clamp(parseBRL(amountFiat)) / rate : 0;
                setAmountCrypto(cr ? cr.toFixed(6) : '');
                setAmountFiat('');
            }
        },
        [mode, availableTokens, amountCrypto, amountFiat, rate]
    );

    const swapSides = useCallback(() => {
        if (mode === 'buy') {
            setMode('sell');
            setPaySymbol(rcvSymbol);
            setRcvSymbol('BRL');
            const cr = rate ? clamp(parseBRL(amountFiat)) / rate : 0;
            setAmountCrypto(cr ? cr.toFixed(6) : '');
            setAmountFiat('');
        } else {
            setMode('buy');
            setRcvSymbol(paySymbol);
            setPaySymbol('BRL');
            const brl = (Number(amountCrypto) || 0) * (rate || 0);
            setAmountFiat(brl ? toBRL(brl) : '');
            setAmountCrypto('');
        }
    }, [mode, rcvSymbol, paySymbol, amountFiat, amountCrypto, rate]);

    const [openNet, setOpenNet] = useState(false);
    const [openToken, setOpenToken] = useState(false);

    const belowMin = mode === 'buy' && fiat > 0 && fiat < MIN_BRL;
    const disabled = mode === 'buy' ? !(fiat >= MIN_BRL) : !(Number(amountCrypto) || 0);

    /* ---------- UI ---------- */
    return (
        <>
            {/* fundo escuro */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[#0a1220] dark:bg-[#070b16]" />
                <div className="absolute inset-0 bg-[radial-gradient(1100px_600px_at_10%_-5%,rgba(60,100,255,.22),transparent),radial-gradient(900px_600px_at_90%_110%,rgba(0,200,150,.16),transparent)]" />
                <div className="absolute inset-0 bg-[url('/assets/textures/noise.png')] opacity-[.07]" />
            </div>

            <motion.main className="relative z-10 mx-auto max-w-[900px] px-4 py-8 md:py-12" variants={list} initial="hidden" animate="show">
                {/* header */}
                <header className="mb-6 flex items-center justify-between">
                    <motion.button
                        variants={fade}
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/85 hover:bg-white/10 transition"
                    >
                        <ArrowLeft size={16} /> Voltar
                    </motion.button>

                    <motion.nav variants={fade} className="flex gap-2 rounded-full border border-white/10 bg-white/5 p-1">
                        <button
                            onClick={() => switchMode('buy')}
                            className={`rounded-full px-5 py-1.5 text-sm transition ${mode === 'buy' ? 'bg-white text-black' : 'text-white/75 hover:text-white'}`}
                        >
                            Comprar
                        </button>
                        <button
                            onClick={() => switchMode('sell')}
                            className={`rounded-full px-5 py-1.5 text-sm transition ${mode === 'sell' ? 'bg-white text-black' : 'text-white/75 hover:text-white'}`}
                        >
                            Vender
                        </button>
                    </motion.nav>
                </header>

                {/* card */}
                <motion.section
                    variants={scale}
                    className="rounded-3xl border border-white/10 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,.06),rgba(255,255,255,.03))] p-5 md:p-6 shadow-2xl ring-1 ring-black/10"
                    style={{ boxShadow: '0 20px 60px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.03)' }}
                >
                    {/* rede */}
                    <fieldset className="mb-4">
                        <legend className="mb-2 text-xs text-white/70">Receber na rede</legend>
                        <button
                            onClick={() => setOpenNet(true)}
                            className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-white/90 hover:bg-white/10 transition"
                        >
              <span className="flex items-center gap-2">
                <NetworkLogo id={networkId} size={20} />
                <span className="font-medium">{currentNet?.name ?? 'Arbitrum'}</span>
              </span>
                            <ChevronDown size={18} className="opacity-60" />
                        </button>
                    </fieldset>

                    {/* pagar / receber */}
                    <fieldset className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-4">
                            {/* pagar */}
                            <div>
                                <label className="block text-xs text-white/70">{mode === 'buy' ? 'Pagar com (BRL)' : 'Pagar com'}</label>

                                {mode === 'sell' && (
                                    <button
                                        onClick={() => setOpenToken(true)}
                                        className="mt-2 flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white/90 hover:bg-white/10 transition"
                                    >
                    <span className="flex items-center gap-2">
                      <TokenLogo symbol={paySymbol} size={18} />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {paySymbol} <span className="text-white/60">— {currentToken?.name ?? ''}</span>
                        </span>
                          {currentNet && <span className="text-xs text-white/50">{currentNet.name}</span>}
                      </div>
                    </span>
                                        <ChevronDown size={18} className="opacity-60" />
                                    </button>
                                )}

                                <div className="relative mt-2">
                                    {mode === 'buy' && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/50">R$</span>}
                                    <input
                                        inputMode={mode === 'buy' ? 'numeric' : 'decimal'}
                                        pattern={mode === 'buy' ? '\\d*' : undefined}
                                        placeholder={mode === 'buy' ? '0,00' : '0,000000'}
                                        value={mode === 'buy' ? amountFiat : amountCrypto}
                                        onChange={(e) =>
                                            mode === 'buy'
                                                ? setAmountFiat(maskBRLFromDigits(e.target.value.replace(/\D/g, '')))
                                                : setAmountCrypto(e.target.value)
                                        }
                                        className={`w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-lg text-white/90 placeholder:text-white/40 outline-none focus:border-white/30 ${mode === 'buy' ? 'pl-9' : ''}`}
                                    />
                                    {mode === 'buy' && (
                                        <p className="mt-1.5 text-[11px] text-white/45">
                                            Valor mínimo: R$ {toBRL(MIN_BRL)}
                                            {belowMin && (
                                                <span className="ml-2 inline-flex items-center gap-1 text-amber-300">
                          <Info size={12} /> abaixo do mínimo
                        </span>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* swap */}
                            <div className="grid place-content-center">
                                <button
                                    onClick={swapSides}
                                    className="group grid place-content-center rounded-full border border-white/15 bg-white/[0.06] p-2 hover:bg-white/[0.12] transition"
                                    aria-label="Inverter"
                                >
                                    <ArrowLeftRight size={18} className="text-white/80 group-hover:text-white" />
                                </button>
                            </div>

                            {/* receber */}
                            <div>
                                <label className="block text-xs text-white/70">{mode === 'buy' ? 'Receber' : 'Receber (BRL)'}</label>

                                {mode === 'buy' && (
                                    <button
                                        onClick={() => setOpenToken(true)}
                                        className="mt-2 flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white/90 hover:bg-white/10 transition"
                                    >
                    <span className="flex items-center gap-2">
                      <TokenLogo symbol={rcvSymbol} size={18} />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {rcvSymbol} <span className="text-white/60">— {currentToken?.name ?? ''}</span>
                        </span>
                          {currentNet && <span className="text-xs text-white/50">{currentNet.name}</span>}
                      </div>
                    </span>
                                        <ChevronDown size={18} className="opacity-60" />
                                    </button>
                                )}

                                <input
                                    readOnly
                                    value={
                                        loading
                                            ? 'calculando…'
                                            : mode === 'buy'
                                                ? (outCrypto || 0).toFixed(6)
                                                : `R$ ${toBRL(outFiat || 0)}`
                                    }
                                    className="mt-2 w-full cursor-not-allowed rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-lg text-white/70"
                                />
                                {error && <p className="mt-1 text-[11px] text-amber-300">{error}</p>}
                            </div>
                        </div>
                    </fieldset>

                    {/* cupom */}
                    <fieldset className="mt-4">
                        <div
                            className={[
                                'relative rounded-2xl border bg-white/[0.04] p-2',
                                'border-white/10',
                                couponStatus === 'ok' && 'border-emerald-400/40 ring-1 ring-emerald-400/15',
                                (couponStatus === 'invalid' || couponStatus === 'expired') && 'border-rose-400/40 ring-1 ring-rose-400/10',
                            ].filter(Boolean).join(' ')}
                        >
                            <div className="flex items-stretch gap-2">
                                <input
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                                    placeholder="Digite seu cupom (opcional)"
                                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-white/90 placeholder:text-white/40 outline-none focus:border-white/25"
                                />
                                <button
                                    onClick={() => (coupon ? setCoupon('') : null)}
                                    title={coupon ? 'Limpar cupom' : 'Sem cupom'}
                                    className={[
                                        'shrink-0 w-9 rounded-xl grid place-items-center border transition',
                                        coupon ? 'border-white/15 bg-white/[0.06] hover:bg-white/[0.12]' : 'border-white/10 bg-white/[0.04] opacity-60 cursor-default',
                                    ].join(' ')}
                                >
                                    {coupon ? '×' : '–'}
                                </button>
                            </div>

                            <div className="px-2 pb-2 pt-1 text-xs">
                                {couponStatus === 'loading' && <span className="text-white/60">Validando…</span>}
                                {couponStatus === 'ok' && couponData && (
                                    <span className="text-emerald-300">
                      Aplicado: -{Math.round((couponData.discountPct ?? 0) * 100)}%
                                        {mode === 'buy' && couponData.minAmountBRL ? ` (mín.: R$ ${toBRL(couponData.minAmountBRL)})` : ''}
                                        {mode === 'buy' && !meetsMin && (
                                            <span className="ml-2 text-amber-300">Abaixo do mínimo para o cupom</span>
                                        )}
                    </span>
                                )}
                                {couponStatus === 'expired' && <span className="text-amber-300">Cupom expirado</span>}
                                {couponStatus === 'invalid' && <span className="text-rose-400">{couponErr}</span>}
                            </div>
                        </div>
                    </fieldset>

                    {/* resumo */}
                    <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm">
                        <div className="flex items-center justify-between text-white/75">
                            <span>Taxa de processamento</span>
                            <span>{Math.round(effectiveFee * 100)}%</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-white">
                            <span>** Valor aproximado final</span>
                            <span>
                                {mode === 'buy'
                                    ? `${(outCrypto || 0).toFixed(6)} ${rcvSymbol}`
                                    : `R$ ${toBRL(outFiat ? outFiat * (1 - couponPct) : 0)}`}
                            </span>
                        </div>

                        <div className="mt-1 text-[11px] text-white/50">
                            Preço base: R$ {toBRL(rate || 0)} / {mode === 'buy' ? rcvSymbol : paySymbol}
                        </div>
                        {couponStatus === 'ok' && (
                            <div className="mt-1 text-[11px] text-white/50">
                                Taxa base: {Math.round(BASE_FEE * 100)}% — desconto de cupom: {Math.round((couponData?.discountPct ?? 0) * 100)}%
                            </div>
                        )}
                    </section>

                    {/* CTA */}
                    <motion.button
                        variants={fade}
                        disabled={disabled}
                        className="mt-4 w-full rounded-2xl border border-emerald-400/40 bg-gradient-to-b from-emerald-400 to-emerald-500 text-emerald-950 px-4 py-4 text-sm font-semibold shadow-[0_10px_40px_rgba(16,185,129,.35)] hover:brightness-105 active:translate-y-[0.5px] disabled:opacity-40 disabled:cursor-not-allowed
                       dark:from-emerald-500/25 dark:to-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/40"
                        onClick={() => {
                            alert(
                                mode === 'buy'
                                    ? `Compra simulada de ${(outCrypto || 0).toFixed(6)} ${rcvSymbol} na ${currentNet?.name} (R$ ${toBRL(rate || 0)}/un) ${couponData ? `com cupom ${couponData.code}` : ''}`
                                    : `Venda simulada de ${Number(amountCrypto) || 0} ${paySymbol} (R$ ${toBRL(rate || 0)}/un) ${couponData ? `com cupom ${couponData.code}` : ''}`
                            );
                        }}
                    >
                        {mode === 'buy' ? `Comprar ${rcvSymbol}` : `Vender ${paySymbol}`}
                    </motion.button>

                    <p className="mt-2 text-[10px] text-white/45">
                        ** Cotação em tempo real (CoinGecko). Taxas e valores aproximados.
                    </p>
                </motion.section>

                {/* modais */}
                <ModalSelect
                    open={openNet}
                    onClose={() => setOpenNet(false)}
                    title="Escolha uma rede"
                    placeholder="Pesquisar rede"
                    items={networksItems}
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
            </motion.main>
        </>
    );
}
