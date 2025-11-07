import FinanceAside from '@/components/finance/FinanceAside';
import SummaryCards from '@/components/finance/SummaryCards';
import FiltersBar from '@/components/finance/FiltersBar';
import TransactionsTable from '@/components/finance/TransactionsTable';

export const metadata = { title: 'Extrato da conta' };

export default function Page(){
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px,1fr]">
      {/* Aside esquerdo */}
      <aside className="lg:sticky lg:top-4 lg:h-max">
        <FinanceAside />
      </aside>

      {/* Conteúdo principal */}
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Extrato da conta</h1>
          <p className="mt-1 text-sm text-white/70">Acompanhe todos os detalhes da sua conta 4Pay.</p>
        </div>

        <SummaryCards />
        <FiltersBar />
        <div>
          <label className="mb-2 block text-sm text-white/60">Descrição</label>
          <TransactionsTable />
        </div>
      </section>
    </div>
  );
}
