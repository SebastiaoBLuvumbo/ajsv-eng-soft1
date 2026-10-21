/** Indicador de carregamento. */
export default function Carregando({ texto = 'A carregar…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-slate-500" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-azul/20 border-t-azul" />
      {texto}
    </div>
  );
}
