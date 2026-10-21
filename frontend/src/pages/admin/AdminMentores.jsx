import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api, mensagemErro } from '../../api.js';
import Avatar from '../../components/Avatar.jsx';
import Aviso from '../../components/Aviso.jsx';
import Carregando from '../../components/Carregando.jsx';
import EstadoVazio from '../../components/EstadoVazio.jsx';
import Estrelas from '../../components/Estrelas.jsx';
import Etiqueta from '../../components/Etiqueta.jsx';
import Icone from '../../components/Icone.jsx';
import { useDados } from '../../hooks/useDados.js';
import { ESTADOS_MENTOR, formatarKz } from '../../utils/formatar.js';

const ORDEM = { PENDENTE: 0, APROVADO: 1, REJEITADO: 2 };
const FILTROS = [['', 'Todos'], ['PENDENTE', 'Pendentes'], ['APROVADO', 'Aprovados'], ['REJEITADO', 'Rejeitados']];

/** Aprovação de mentores, mostrando a prova da bolsa. Os pendentes aparecem primeiro. */
export default function AdminMentores() {
  const { recarregarContadores } = useOutletContext();
  const { dados: mentores, setDados, erro, aCarregar } = useDados(() => api.get('/admin/mentores').then((r) => r.data));
  const [filtro, setFiltro] = useState('');
  const [aMudar, setAMudar] = useState(null);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  async function decidir(m, acao) {
    setAMudar(m.id);
    setMensagem({ tipo: '', texto: '' });
    try {
      const { data } = await api.put(`/admin/mentores/${m.id}/${acao}`);
      setDados((lista) => lista.map((x) => (x.id === data.id ? data : x)));
      setMensagem({ tipo: 'sucesso', texto: `O perfil de ${m.nome} foi ${acao === 'aprovar' ? 'aprovado' : 'rejeitado'}.` });
      recarregarContadores();
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: mensagemErro(e) });
    } finally {
      setAMudar(null);
    }
  }

  if (aCarregar && !mentores) return <Carregando />;
  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;
  if (!mentores) return null;

  const contagem = (estado) => mentores.filter((m) => !estado || m.estado === estado).length;
  const lista = mentores
    .filter((m) => !filtro || m.estado === filtro)
    .sort((a, b) => ORDEM[a.estado] - ORDEM[b.estado] || a.nome.localeCompare(b.nome, 'pt'));

  return (
    <div className="space-y-5">
      {/* Filtro por estado */}
      <div className="flex flex-wrap gap-2">
        {FILTROS.map(([valor, rotulo]) => (
          <button
            key={valor}
            type="button"
            aria-pressed={filtro === valor}
            onClick={() => setFiltro(valor)}
            className={`btn btn-sm ${filtro === valor ? 'bg-azul text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-claro'}`}
          >
            {rotulo} <span className="opacity-70">({contagem(valor)})</span>
          </button>
        ))}
      </div>

      {mensagem.texto && <Aviso tipo={mensagem.tipo}>{mensagem.texto}</Aviso>}

      {lista.length === 0 && <EstadoVazio icone="escudo" titulo="Nenhum mentor neste estado" />}

      <div className="grid gap-4 lg:grid-cols-2">
        {lista.map((m) => {
          const estado = ESTADOS_MENTOR[m.estado];
          const provaELink = /^https?:\/\//i.test(m.provaBolsa ?? '');
          return (
            <article key={m.id} className={`cartao flex flex-col p-5 ${m.estado === 'PENDENTE' ? 'border-orange-200 ring-1 ring-orange-100' : ''}`}>
              <div className="flex items-start gap-3">
                <Avatar nome={m.nome} fotoUrl={m.fotoUrl} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-azul">{m.nome}</p>
                  <p className="truncate text-sm text-slate-500">{m.email}{m.telefone && ` · ${m.telefone}`}</p>
                </div>
                <Etiqueta cor={estado.cor}>{estado.rotulo}</Etiqueta>
              </div>

              <dl className="mt-4 grid gap-2 text-[15px]">
                <div className="flex gap-2">
                  <dt className="text-slate-500">Bolsa:</dt>
                  <dd className="font-medium text-slate-800">
                    {m.bolsaGanhaNome ?? <span className="italic text-slate-500">Não está na lista</span>}
                    {m.anoBolsa && ` (${m.anoBolsa})`}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-slate-500">Preço:</dt>
                  <dd className="font-medium text-verde">{formatarKz(m.preco)}</dd>
                </div>
                {m.estado === 'APROVADO' && (
                  <div className="flex gap-2">
                    <dt className="text-slate-500">Avaliação:</dt>
                    <dd><Estrelas valor={m.avaliacaoMedia} total={m.totalAvaliacoes} /></dd>
                  </div>
                )}
              </dl>

              {/* Prova da bolsa */}
              <div className="mt-3 rounded-xl bg-claro/70 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-azul">Prova da bolsa</p>
                {!m.provaBolsa ? (
                  <p className="text-sm italic text-slate-500">Não indicada.</p>
                ) : provaELink ? (
                  <a href={m.provaBolsa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 break-all text-sm font-medium text-verde hover:underline">
                    <Icone nome="ligacao" className="h-4 w-4 shrink-0" />{m.provaBolsa}
                  </a>
                ) : (
                  <p className="break-words text-sm text-slate-700">{m.provaBolsa}</p>
                )}
              </div>

              {m.descricao && <p className="mt-3 line-clamp-3 text-sm text-slate-600">{m.descricao}</p>}

              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                {m.estado !== 'APROVADO' && (
                  <button type="button" className="btn-secundario btn-sm" disabled={aMudar === m.id} onClick={() => decidir(m, 'aprovar')}>
                    <Icone nome="check" className="h-4 w-4" /> Aprovar
                  </button>
                )}
                {m.estado !== 'REJEITADO' && (
                  <button type="button" className="btn-perigo btn-sm" disabled={aMudar === m.id} onClick={() => decidir(m, 'rejeitar')}>
                    <Icone nome="fechar" className="h-4 w-4" /> Rejeitar
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
