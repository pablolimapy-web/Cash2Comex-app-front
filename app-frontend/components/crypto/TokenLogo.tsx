'use client';

type Props = { symbol: 'ETH' | 'USDT' | 'BRL' | string; size?: number };

export default function TokenLogo({ symbol, size = 18 }: Props) {
    const s = symbol.toUpperCase();
    if (s === 'ETH') {
        return (
            <svg width={size} height={size} viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <g fill="currentColor">
                    <path d="M127.9 0l-2.8 9.6v274.8l2.8 2.8 127.9-75.4z" opacity=".8"/>
                    <path d="M127.9 0L0 211.8l127.9 75.4V0z" opacity=".5"/>
                    <path d="M127.9 311.7l-1.6 1.9v102.5l1.6 4.7 128-180.2z" opacity=".8"/>
                    <path d="M127.9 420.8V311.7L0 239.1z" opacity=".5"/>
                </g>
            </svg>
        );
    }
    if (s === 'USDT') {
        return (
            <svg width={size} height={size} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <circle cx="200" cy="200" r="200" fill="#26A17B"/>
                <path d="M90 130h220v40h-90v25c51 6 86 20 86 37 0 21-60 38-134 38S38 253 38 232c0-17 35-31 86-37v-25H90v-40zm110 141c60 0 108-10 108-22 0-9-31-17-75-21v39h-66v-39c-44 4-75 12-75 21 0 12 48 22 108 22z" fill="#fff"/>
            </svg>
        );
    }
    if (s === 'BRL') {
        return (
            <div style={{ width: size, height: size }} className="grid place-content-center rounded-full bg-green-500/60 text-[10px] font-bold text-white">
                R$
            </div>
        );
    }
    return (
        <div style={{ width: size, height: size }} className="grid place-content-center rounded-full bg-white/10 text-[10px] text-white">
            {s.slice(0,3)}
        </div>
    );
}
