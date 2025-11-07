'use client';

import { ChevronDown, ArrowUpRight, ArrowDownRight, Clock3 } from 'lucide-react';

function Card({children, className}:{children:React.ReactNode; className?:string}){
  return <div className={`rounded-2xl border p-5 ${className}`}>{children}</div>;
}

export default function SummaryCards(){
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="border-emerald-900/40 bg-emerald-900/20">
        <div className="flex items-center gap-2 text-emerald-300">
          <ChevronDown size={16}/><span className="font-medium">Entradas</span>
        </div>
        <div className="mt-4 text-lg font-semibold text-white">R$ 0,00</div>
      </Card>

      <Card className="border-rose-900/40 bg-rose-900/20">
        <div className="flex items-center gap-2 text-rose-300">
          <ArrowDownRight size={16}/><span className="font-medium">Saídas</span>
        </div>
        <div className="mt-4 text-lg font-semibold text-white">R$ 0,00</div>
      </Card>

      <Card className="border-amber-900/40 bg-amber-900/20">
        <div className="flex items-center gap-2 text-amber-300">
          <Clock3 size={16}/><span className="font-medium">Pagamentos agendados</span>
        </div>
        <div className="mt-4 text-lg font-semibold text-white">R$ 0,00</div>
      </Card>
    </div>
  );
}
