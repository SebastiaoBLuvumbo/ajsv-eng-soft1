import Icone from './Icone.jsx';

/** Mensagem para listas vazias, com uma ação opcional. */
export default function EstadoVazio({ icone = 'caixa', titulo, children, acao }) {
  return (
    <div className="rounded-2xl border border-dashed border-azul/20 bg-white px-6 py-12 text-center">
      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-claro text-azul">
        <Icone nome={icone} className="h-6 w-6" />
      </span>
      <p className="font-titulo text-lg font-semibold text-azul">{titulo}</p>
      {children && <p className="mx-auto mt-1 max-w-md text-slate-500">{children}</p>}
      {acao && <div className="mt-5">{acao}</div>}
    </div>
  );
}
