'use client';

import { CalendarDays } from 'lucide-react';

export default function FiltersBar(){
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
        <label className="text-xs text-white/60">Período</label>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white/80">
            <div className="flex items-center gap-2"><CalendarDays size={16}/><input type="date" className="w-full bg-transparent outline-none"/></div>
          </div>
          <span className="text-white/40">até</span>
          <div className="flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white/80">
            <div className="flex items-center gap-2"><CalendarDays size={16}/><input type="date" className="w-full bg-transparent outline-none"/></div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 md:col-span-1 lg:col-span-1">
        <label className="text-xs text-white/60">Tipo de transação</label>
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
          <select className="w-full rounded-xl border border-white/10 bg-black/20 p-2 text-white/80 outline-none">
            <option>Entradas</option>
            <option>Saídas</option>
            <option>Pagamentos agendados</option>
            <option>Todas</option>
          </select>
        </div>
      </div>
    </div>
  );
}
