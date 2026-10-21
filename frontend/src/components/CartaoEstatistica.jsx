import Icone from './Icone.jsx';

/** Cartão com um número de resumo para os painéis da área reservada. */
const TONS = {
  azul: 'bg-claro text-azul',
  verde: 'bg-verde-claro text-verde',
  dourado: 'bg-dourado-claro text-dourado-escuro',
  laranja: 'bg-orange-50 text-orange-600',
  vermelho: 'bg-red-50 text-red-600',
};

export default function CartaoEstatistica({ icone, rotulo, valor, detalhe, tom = 'azul' }) {
  return (
    <div className="cartao flex items-start gap-4 p-5">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TONS[tom]}`}>
        <Icone nome={icone} className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">{rotulo}</p>
        <p className="font-titulo text-2xl font-semibold text-azul">{valor}</p>
        {detalhe && <p className="mt-0.5 text-sm text-slate-500">{detalhe}</p>}
      </div>
    </div>
  );
}
