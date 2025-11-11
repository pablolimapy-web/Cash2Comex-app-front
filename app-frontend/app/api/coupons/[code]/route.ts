// app/api/coupons/[code]/route.ts
import { NextResponse } from 'next/server';

type Coupon = {
    code: string;
    discountPct: number;       // 0.10 = 10%
    minAmountBRL?: number;
    expiresAt?: string;        // ISO
    description?: string;
};

const MOCK_COUPONS: Record<string, Coupon> = {
    '4PAY10':   { code: '4PAY10',   discountPct: 0.10, minAmountBRL: 250,  expiresAt: '2099-12-31T23:59:59Z', description: '10% off (teste)' },
    'WELCOME5': { code: 'WELCOME5', discountPct: 0.05, minAmountBRL: 0,    expiresAt: '2099-12-31T23:59:59Z', description: '5% off (teste)' },
    'EXPIRED':  { code: 'EXPIRED',  discountPct: 0.15, minAmountBRL: 100,  expiresAt: '2000-01-01T00:00:00Z', description: 'cupom expirado' },
    'BIG10':    { code: 'BIG10',    discountPct: 0.10, minAmountBRL: 1000, expiresAt: '2099-12-31T23:59:59Z', description: '10% para pedidos maiores' },
};

export async function GET(_req: Request, { params }: { params: { code: string } }) {
    const code = (params.code ?? '').toUpperCase();
    const now = new Date();

    const found = MOCK_COUPONS[code];
    if (!found) {
        return NextResponse.json({ ok: false, reason: 'not_found' }, { status: 404 });
    }

    const expiresAt = found.expiresAt ? new Date(found.expiresAt) : null;
    if (expiresAt && expiresAt < now) {
        return NextResponse.json({ ok: false, reason: 'expired', coupon: found }, { status: 400 });
    }

    return NextResponse.json({ ok: true, coupon: found }, { status: 200 });
}
