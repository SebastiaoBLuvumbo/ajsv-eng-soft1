/** Indicador de carregamento. */
export default function Carregando({ texto = 'A carregar…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-slate-500" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-azul/20 border-t-azul" />
      {texto}
    </div>
  );
}

/** Cartão fantasma com a mesma estrutura do CartaoBolsa. */
export function EsqueletoCartao() {
  return (
    <div className="cartao flex h-full flex-col p-5" aria-hidden="true">
      <div className="flex gap-2">
        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200 motion-reduce:animate-none" />
        <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200 motion-reduce:animate-none" />
      </div>
      <div className="mt-4 h-5 w-4/5 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
      <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
      <div className="mt-4 h-4 w-2/5 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
      <div className="mt-auto flex justify-between border-t border-slate-100 pt-4">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200 motion-reduce:animate-none" />
      </div>
    </div>
  );
}