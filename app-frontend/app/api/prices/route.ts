import { NextResponse } from 'next/server';

export const revalidate = 30; // cache 30s no Next (opcional)

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get('ids');     // ex: "bitcoin,ethereum,tether"
    const vs  = searchParams.get('vs') || 'brl';

    if (!ids) {
        return NextResponse.json({ error: 'Missing ids' }, { status: 400 });
    }

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
        ids
    )}&vs_currencies=${encodeURIComponent(vs)}`;

    try {
        const r = await fetch(url, { next: { revalidate } });
        if (!r.ok) throw new Error(`CG status ${r.status}`);
        const data = await r.json();
        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? 'fetch failed' }, { status: 500 });
    }
}
