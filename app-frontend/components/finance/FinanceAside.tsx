'use client';

import { HelpCircle, Wallet, TrendingUp, TrendingDown, ArrowRightLeft, CreditCard, Headphones, Settings } from 'lucide-react';
import Link from 'next/link';

function Card({children}:{children: React.ReactNode}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      {children}
    </div>
  );
}

export default function FinanceAside() {
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/70">Saldo disponível</span>
          <button className="rounded-xl border border-white/10 p-1 text-white/60 hover:bg-white/5" aria-label="Mostrar/ocultar">
            <svg width="14" height="14" viewBox="0 0 24 24" className="opacity-70"><path fill="currentColor" d="M12 4a8 8 0 0 1 6.32 3.09l1.4-1.4A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8m0 16a8 8 0 0 1-6.32-3.09l-1.4 1.4A10 10 0 0 0 22 12h-2a8 8 0 0 1-8 8Z"/></svg>
          </button>
        </div>
        <div className="mt-2 text-2xl font-semibold text-white">R$ 0,00</div>
        <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500/80" />
          Valor indisponível
        </div>
      </Card>

      <Card>
        <div className="text-xs font-medium uppercase tracking-wide text-white/50">Criptomoedas</div>
        <nav className="mt-3 grid gap-2 text-sm">
          <Link href="#" className="flex items-center justify-between rounded-xl px-2 py-2 text-white/80 hover:bg-white/5">
            <span className="flex items-center gap-2"><CreditCard size={16}/> Comprar</span>
            <span className="text-white/40">↗</span>
          </Link>
          <Link href="#" className="flex items-center justify-between rounded-xl px-2 py-2 text-white/80 hover:bg-white/5">
            <span className="flex items-center gap-2"><ArrowRightLeft size={16}/> Vender</span>
            <span className="text-white/40">↗</span>
          </Link>
        </nav>
      </Card>

      <Card>
        <div className="text-xs font-medium uppercase tracking-wide text-white/50">Minha Conta</div>
        <nav className="mt-3 grid gap-2 text-sm">
          <Link href="/finance/extrato" className="flex items-center gap-2 rounded-xl bg-white/5 px-2 py-2 text-white">
            <Wallet size={16}/> Extrato
          </Link>
          <Link href="#" className="flex items-center gap-2 rounded-xl px-2 py-2 text-white/80 hover:bg-white/5">
            <ArrowRightLeft size={16}/> Transferências
          </Link>
          <Link href="#" className="flex items-center gap-2 rounded-xl px-2 py-2 text-white/80 hover:bg-white/5">
            <CreditCard size={16}/> Pagamentos
          </Link>
          <Link href="#" className="flex items-center gap-2 rounded-xl px-2 py-2 text-white/80 hover:bg-white/5">
            <TrendingUp size={16}/> Extrato Afiliado
          </Link>
        </nav>
      </Card>

      <Card>
        <div className="text-xs font-medium uppercase tracking-wide text-white/50">Ajuda</div>
        <nav className="mt-3 grid gap-2 text-sm">
          <Link href="#" className="flex items-center justify-between rounded-xl px-2 py-2 text-white/80 hover:bg-white/5">
            <span className="flex items-center gap-2"><Headphones size={16}/> Suporte WhatsApp</span>
            <span className="text-white/40">↗</span>
          </Link>
          <Link href="#" className="flex items-center gap-2 rounded-xl px-2 py-2 text-white/80 hover:bg-white/5">
            <Settings size={16}/> Configurações
          </Link>
        </nav>
      </Card>
    </div>
  );
}
