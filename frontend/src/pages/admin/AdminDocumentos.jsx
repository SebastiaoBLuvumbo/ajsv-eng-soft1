import { useState } from 'react';
import { api, mensagemErro } from '../../api.js';
import Aviso from '../../components/Aviso.jsx';
import Carregando from '../../components/Carregando.jsx';
import Icone from '../../components/Icone.jsx';
import { useDados } from '../../hooks/useDados.js';

/**
 * Tipos de documento: edição do nome, do tempo médio e da descrição na própria tabela.
 * Mudar o tempo médio faz o backend recalcular as datas limite dos estudantes.
 */
export default function AdminDocumentos() {
  const { dados: tipos, setDados, erro, aCarregar } = useDados(() => api.get('/admin/tipos-documento').then((r) => r.data));
  const [edicoes, setEdicoes] = useState({}); // alterações por id, ainda não guardadas
  const [novo, setNovo] = useState({ nome: '', tempoMedioDias: '', descricao: '' });
  const [aGuardar, setAGuardar] = useState(null);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  // Valor a mostrar numa célula: a edição (se existir) ou o valor guardado
  const valor = (t, campo) => edicoes[t.id]?.[campo] ?? t[campo] ?? '';

  function editar(t, campo, v) {
    setEdicoes({ ...edicoes, [t.id]: { ...edicoes[t.id], [campo]: v } });
  }

  const alterado = (t) =>
    !!edicoes[t.id] && ['nome', 'tempoMedioDias', 'descricao'].some((c) => String(valor(t, c)) !== String(t[c] ?? ''));

  async function guardar(t) {
    setAGuardar(t.id);
    setMensagem({ tipo: '', texto: '' });
    try {
      const { data } = await api.put(`/admin/tipos-documento/${t.id}`, {
        nome: String(valor(t, 'nome')).trim(),
        tempoMedioDias: Number(valor(t, 'tempoMedioDias')),
        descricao: String(valor(t, 'descricao')).trim(),
      });
      setDados((lista) => lista.map((x) => (x.id === t.id ? data : x)));
      setEdicoes((atuais) => {
        const resto = { ...atuais };
        delete resto[t.id];
        return resto;
      });
      const mudouTempo = data.tempoMedioDias !== t.tempoMedioDias;
      setMensagem({
        tipo: 'sucesso',
        texto: mudouTempo
          ? `«${data.nome}» guardado. As datas limite dos estudantes que seguem bolsas com este documento foram recalculadas.`
          : `«${data.nome}» guardado.`,
      });
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: mensagemErro(e) });
    } finally {
      setAGuardar(null);
    }
  }

  async function adicionar(e) {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });
    setAGuardar('novo');
    try {
      const { data } = await api.post('/admin/tipos-documento', {
        nome: novo.nome.trim(),
        tempoMedioDias: novo.tempoMedioDias === '' ? null : Number(novo.tempoMedioDias),
        descricao: novo.descricao.trim(),
      });
      setDados((lista) => [...lista, data].sort((a, b) => a.nome.localeCompare(b.nome, 'pt')));
      setNovo({ nome: '', tempoMedioDias: '', descricao: '' });
      setMensagem({ tipo: 'sucesso', texto: `Documento «${data.nome}» adicionado.` });
    } catch (e2) {
      setMensagem({ tipo: 'erro', texto: mensagemErro(e2) });
    } finally {
      setAGuardar(null);
    }
  }

  async function apagar(t) {
    if (!window.confirm(`Apagar o documento «${t.nome}»?`)) return;
    setMensagem({ tipo: '', texto: '' });
    try {
      await api.delete(`/admin/tipos-documento/${t.id}`);
      setDados((lista) => lista.filter((x) => x.id !== t.id));
      setMensagem({ tipo: 'sucesso', texto: `Documento «${t.nome}» apagado.` });
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: mensagemErro(e) });
    }
  }

  if (aCarregar && !tipos) return <Carregando />;
  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;
  if (!tipos) return null;

  return (
    <div className="space-y-5">
      <Aviso tipo="info" titulo="Como funciona o tempo médio">
        O tempo médio é quanto um documento demora a tratar em Angola. Ao mudá-lo, as datas limite
        («começar até») dos estudantes que seguem bolsas com este documento são recalculadas automaticamente.
      </Aviso>

      {mensagem.texto && <Aviso tipo={mensagem.tipo}>{mensagem.texto}</Aviso>}

      {/* Adicionar documento */}
      <form onSubmit={adicionar} className="cartao grid gap-3 p-4 sm:grid-cols-[2fr_120px_3fr_auto] sm:items-end">
        <div>
          <label htmlFor="n-nome" className="rotulo">Novo documento</label>
          <input id="n-nome" required className="campo" value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} placeholder="Nome" />
        </div>
        <div>
          <label htmlFor="n-tempo" className="rotulo">Dias</label>
          <input id="n-tempo" type="number" min="1" required className="campo" value={novo.tempoMedioDias} onChange={(e) => setNovo({ ...novo, tempoMedioDias: e.target.value })} />
        </div>
        <div>
          <label htmlFor="n-desc" className="rotulo">Descrição</label>
          <input id="n-desc" className="campo" value={novo.descricao} onChange={(e) => setNovo({ ...novo, descricao: e.target.value })} />
        </div>
        <button type="submit" className="btn-primario" disabled={aGuardar === 'novo'}>
          <Icone nome="mais" className="h-4 w-4" /> Adicionar
        </button>
      </form>

      {/* Tabela editável */}
      <div className="cartao overflow-x-auto">
        <table className="tabela min-w-[760px]">
          <thead>
            <tr>
              <th className="w-[28%]">Nome</th>
              <th className="w-[130px]">Tempo médio (dias)</th>
              <th>Descrição</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tipos.map((t) => (
              <tr key={t.id} className={alterado(t) ? 'bg-dourado-claro/40' : ''}>
                <td>
                  <input className="campo py-1.5" value={valor(t, 'nome')} onChange={(e) => editar(t, 'nome', e.target.value)} aria-label="Nome" />
                </td>
                <td>
                  <input type="number" min="1" className="campo py-1.5" value={valor(t, 'tempoMedioDias')} onChange={(e) => editar(t, 'tempoMedioDias', e.target.value)} aria-label="Tempo médio em dias" />
                </td>
                <td>
                  <input className="campo py-1.5" value={valor(t, 'descricao')} onChange={(e) => editar(t, 'descricao', e.target.value)} aria-label="Descrição" />
                </td>
                <td>
                  <div className="flex justify-end gap-1">
                    <button type="button" className="btn-secundario btn-sm" disabled={!alterado(t) || aGuardar === t.id} onClick={() => guardar(t)}>
                      {aGuardar === t.id ? 'A guardar…' : 'Guardar'}
                    </button>
                    <button type="button" className="btn btn-sm text-red-700 hover:bg-red-50" onClick={() => apagar(t)} aria-label={`Apagar ${t.nome}`}>
                      <Icone nome="lixo" className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
