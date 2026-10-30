/** Cartões skeleton para listas de bolsas enquanto os dados são carregados. */
export default function CarregandoBolsas() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="A carregar bolsas">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="cartao min-h-[220px] animate-pulse p-5" aria-hidden="true">
          <div className="flex gap-2">
            <span className="h-6 w-20 rounded-full bg-slate-200" />
            <span className="h-6 w-24 rounded-full bg-slate-200" />
          </div>
          <div className="mt-5 h-5 w-3/4 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
          <div className="mt-5 h-4 w-2/3 rounded bg-slate-100" />
          <div className="mt-6 border-t border-slate-100 pt-4">
            <div className="h-4 w-full rounded bg-slate-100" />
          </div>
        </div>
      ))}
      <span className="sr-only">A carregar bolsas…</span>
    </div>
  );
}
