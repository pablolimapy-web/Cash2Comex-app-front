'use client';

import { Ban } from 'lucide-react';

export default function TransactionsTable(){
  // estado vazio por enquanto
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="text-left text-sm text-white/60">
            <tr>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Tipo de transação</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="flex items-center gap-2 px-4 py-5 text-white/70">
        <Ban size={16} className="opacity-70"/>
        Nenhuma transação foi encontrada
      </div>
    </div>
  );
}
