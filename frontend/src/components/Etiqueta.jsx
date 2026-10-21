/** Pequena etiqueta colorida (estado, tipo, nível…). */
const CORES = {
  azul: 'bg-claro text-azul ring-azul/15',
  verde: 'bg-verde-claro text-verde-escuro ring-verde/20',
  dourado: 'bg-dourado-claro text-dourado-escuro ring-dourado/30',
  laranja: 'bg-orange-50 text-orange-700 ring-orange-200',
  vermelho: 'bg-red-50 text-red-700 ring-red-200',
  cinza: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export default function Etiqueta({ cor = 'azul', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${CORES[cor] ?? CORES.azul} ${className}`}
    >
      {children}
    </span>
  );
}
