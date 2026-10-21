import Avatar from './Avatar.jsx';
import Estrelas from './Estrelas.jsx';
import Icone from './Icone.jsx';
import SeloVerificado from './SeloVerificado.jsx';
import { formatarKz } from '../utils/formatar.js';

/** Cartão de um mentor verificado, com o botão "Contratar mentoria". */
export default function CartaoMentor({ mentor, onContratar }) {
  return (
    <article className="cartao flex h-full flex-col p-5">
      <div className="flex items-start gap-4">
        <Avatar nome={mentor.nome} fotoUrl={mentor.fotoUrl} tamanho="h-16 w-16 text-xl" />
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-snug">{mentor.nome}</h3>
          {mentor.verificado && <SeloVerificado className="mt-1" />}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-claro/70 px-3 py-2 text-sm">
        <p className="flex items-start gap-1.5 text-azul">
          <Icone nome="trofeu" className="mt-0.5 h-4 w-4 shrink-0 text-dourado-escuro" />
          <span>
            Ganhou a <strong className="font-semibold">{mentor.bolsaGanhaNome ?? 'uma bolsa de estudo'}</strong>
            {mentor.anoBolsa && <> em {mentor.anoBolsa}</>}
            {mentor.bolsaGanhaPais && <span className="text-slate-500"> · {mentor.bolsaGanhaPais}</span>}
          </span>
        </p>
      </div>

      {mentor.descricao && <p className="mt-3 line-clamp-3 text-[15px] text-slate-600">{mentor.descricao}</p>}

      <div className="mt-3">
        <Estrelas valor={mentor.avaliacaoMedia} total={mentor.totalAvaliacoes} />
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p>
          <span className="block text-xs text-slate-500">Mentoria</span>
          <span className="font-titulo text-lg font-semibold text-verde">{formatarKz(mentor.preco)}</span>
        </p>
        {onContratar && (
          <button type="button" className="btn-primario" onClick={() => onContratar(mentor)}>
            Contratar mentoria
          </button>
        )}
      </div>
    </article>
  );
}
