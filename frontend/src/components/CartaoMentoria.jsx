import Avatar from './Avatar.jsx';
import Estrelas from './Estrelas.jsx';
import Etiqueta from './Etiqueta.jsx';
import Icone from './Icone.jsx';
import { ESTADOS_MENTORIA, formatarData, formatarKz } from '../utils/formatar.js';

/**
 * Cartão de uma mentoria (objeto Mentoria do backend).
 * vista="mentor"    → mostra o estudante (e o contacto, se `mostrarContacto`)
 * vista="estudante" → mostra o mentor
 * `children` recebe os botões de ação.
 */
export default function CartaoMentoria({ mentoria, vista = 'mentor', mostrarContacto = false, children }) {
  const m = mentoria;
  const estado = ESTADOS_MENTORIA[m.estado] ?? { rotulo: m.estado, cor: 'cinza' };
  const pessoa = vista === 'mentor' ? m.estudanteNome : m.mentorNome;

  return (
    <article className="cartao p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar nome={pessoa} tamanho="h-11 w-11 text-sm" />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-slate-500">{vista === 'mentor' ? 'Estudante' : 'Mentor'}</p>
            <p className="font-semibold text-azul">{pessoa}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-titulo font-semibold text-verde">{formatarKz(m.valor)}</span>
          <Etiqueta cor={estado.cor}>{estado.rotulo}</Etiqueta>
        </div>
      </div>

      <dl className="mt-4 grid gap-x-6 gap-y-1 text-sm text-slate-600 sm:grid-cols-2">
        <div className="flex gap-1.5">
          <dt className="text-slate-400">Bolsa:</dt>
          <dd className="font-medium text-slate-700">{m.bolsaNome ?? '—'}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="text-slate-400">Pedido em:</dt>
          <dd className="font-medium text-slate-700">{formatarData(m.dataPedido)}</dd>
        </div>
      </dl>

      {m.mensagem && (
        <blockquote className="mt-3 rounded-xl border-l-4 border-azul/30 bg-fundo px-4 py-3 text-[15px] italic text-slate-700">
          “{m.mensagem}”
        </blockquote>
      )}

      {/* Contacto do estudante (só para mentorias aceites, na área do mentor) */}
      {mostrarContacto && (
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 rounded-xl bg-verde-claro/60 px-4 py-3 text-sm">
          <a href={`mailto:${m.estudanteEmail}`} className="inline-flex items-center gap-1.5 font-medium text-verde-escuro hover:underline">
            <Icone nome="email" className="h-4 w-4" />{m.estudanteEmail}
          </a>
          {m.estudanteTelefone && (
            <a href={`tel:${m.estudanteTelefone}`} className="inline-flex items-center gap-1.5 font-medium text-verde-escuro hover:underline">
              <Icone nome="telefone" className="h-4 w-4" />{m.estudanteTelefone}
            </a>
          )}
        </div>
      )}

      {/* Avaliação já feita */}
      {m.nota && (
        <div className="mt-3 rounded-xl bg-dourado-claro/60 px-4 py-3">
          <Estrelas valor={m.nota} mostrarNumero={false} />
          {m.comentario && <p className="mt-1 text-[15px] text-slate-700">{m.comentario}</p>}
        </div>
      )}

      {children && <div className="mt-4 flex flex-wrap gap-2">{children}</div>}
    </article>
  );
}
