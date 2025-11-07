'use client';

import React from 'react';
import { CreditCard, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

type CardProps = { title: string; value: string; icon?: React.ReactNode; className?: string; };

function StatCard({ title, value, icon, className }: CardProps) {
  return (
    <div className={`rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm ${className ?? ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/70">{title}</span>
        <div className="opacity-70">{icon}</div>
      </div>
      <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default function AccountSummary() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard title="Entradas" value="R$ 0,00" icon={<ArrowUpRight size={18} />} className="bg-emerald-500/10 border-emerald-500/20" />
      <StatCard title="Saídas" value="R$ 0,00" icon={<ArrowDownRight size={18} />} className="bg-rose-500/10 border-rose-500/20" />
      <StatCard title="Pagamentos agendados" value="R$ 0,00" icon={<Clock size={18} />} className="bg-amber-500/10 border-amber-500/20" />
    </div>
  );
}
