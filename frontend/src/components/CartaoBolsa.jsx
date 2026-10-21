import { Link } from 'react-router-dom';
import Etiqueta from './Etiqueta.jsx';
import Icone from './Icone.jsx';
import { NIVEIS, TIPOS, formatarData, textoPrazo } from '../utils/formatar.js';

/** Cartão de uma bolsa na lista e na Home. As bolsas em destaque têm moldura dourada. */
export default function CartaoBolsa({ bolsa }) {
  const dias = bolsa.diasParaPrazo;
  const corPrazo = dias < 0 ? 'cinza' : dias <= 30 ? 'laranja' : 'verde';

  return (
    <Link
      to={`/bolsas/${bolsa.id}`}
      className={`cartao group flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-elevado ${
        bolsa.destaque ? 'border-dourado/60 ring-1 ring-dourado/30' : ''
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Etiqueta cor={bolsa.tipo === 'INTERNA' ? 'verde' : 'azul'}>{TIPOS[bolsa.tipo]}</Etiqueta>
        <Etiqueta cor="cinza">{NIVEIS[bolsa.nivel]}</Etiqueta>
        {bolsa.destaque && (
          <Etiqueta cor="dourado">
            <Icone nome="estrela" className="h-3 w-3" /> Destaque
          </Etiqueta>
        )}
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug group-hover:underline">{bolsa.nome}</h3>
      <p className="mt-1 text-sm text-slate-600">{bolsa.entidade}</p>

      <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
        <Icone nome="globo" className="h-4 w-4 text-verde" />
        {bolsa.pais}
        {bolsa.areaEstudo && <span className="text-slate-400">· {bolsa.areaEstudo}</span>}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
        <span className="flex items-center gap-1.5 text-sm text-slate-600">
          <Icone nome="calendario" className="h-4 w-4" />
          {formatarData(bolsa.prazo)}
        </span>
        <Etiqueta cor={corPrazo}>{textoPrazo(dias)}</Etiqueta>
      </div>
    </Link>
  );
}
