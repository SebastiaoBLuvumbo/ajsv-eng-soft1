import { useState } from 'react';
import { api, mensagemErro } from '../../api.js';
import Aviso from '../../components/Aviso.jsx';
import Carregando from '../../components/Carregando.jsx';
import Etiqueta from '../../components/Etiqueta.jsx';
import Icone from '../../components/Icone.jsx';
import Modal from '../../components/Modal.jsx';
import { useDados } from '../../hooks/useDados.js';
import { NIVEIS, TIPOS, formatarData, textoPrazo } from '../../utils/formatar.js';

const VAZIA = {
  nome: '', entidade: '', pais: '', tipo: 'EXTERNA', areaEstudo: '', nivel: 'MESTRADO',
  descricao: '', requisitos: '', prazo: '', linkOficial: '', destaque: false, documentosIds: [],
};

/** Gestão de bolsas: tabela com criar, editar e apagar (inclui as encerradas). */
export default function AdminBolsas() {
  const { dados, setDados, erro, aCarregar } = useDados(async () => {
    const [bolsas, tipos] = await Promise.all([api.get('/admin/bolsas'), api.get('/admin/tipos-documento')]);
    return { bolsas: bolsas.data, tipos: tipos.data };
  });
  const [form, setForm] = useState(null); // null = fechado; { id?, ...campos }
  const [erroForm, setErroForm] = useState('');
  const [aGuardar, setAGuardar] = useState(false);
  const [apagar, setApagar] = useState(null);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  function abrirNova() {
    setErroForm('');
    setForm({ ...VAZIA });
  }

  function abrirEdicao(b) {
    setErroForm('');
    setForm({
      id: b.id,
      nome: b.nome ?? '', entidade: b.entidade ?? '', pais: b.pais ?? '', tipo: b.tipo, areaEstudo: b.areaEstudo ?? '',
      nivel: b.nivel, descricao: b.descricao ?? '', requisitos: b.requisitos ?? '', prazo: b.prazo ?? '',
      linkOficial: b.linkOficial ?? '', destaque: !!b.destaque, documentosIds: b.documentos.map((d) => d.id),
    });
  }

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  function alternarDocumento(idDoc) {
    const ids = form.documentosIds.includes(idDoc)
      ? form.documentosIds.filter((x) => x !== idDoc)
      : [...form.documentosIds, idDoc];
    setForm({ ...form, documentosIds: ids });
  }

  async function guardar(e) {
    e.preventDefault();
    setErroForm('');
    setAGuardar(true);
    const { id, ...campos } = form;
    const corpo = { ...campos, linkOficial: campos.linkOficial.trim() || null };
    try {
      if (id) {
        const { data } = await api.put(`/admin/bolsas/${id}`, corpo);
        setDados((d) => ({ ...d, bolsas: d.bolsas.map((b) => (b.id === id ? data : b)) }));
        setMensagem({ tipo: 'sucesso', texto: `Bolsa «${data.nome}» atualizada.` });
      } else {
        const { data } = await api.post('/admin/bolsas', corpo);
        setDados((d) => ({ ...d, bolsas: [...d.bolsas, data].sort((a, b) => a.prazo.localeCompare(b.prazo)) }));
        setMensagem({ tipo: 'sucesso', texto: `Bolsa «${data.nome}» criada.` });
      }
      setForm(null);
    } catch (e2) {
      setErroForm(mensagemErro(e2));
    } finally {
      setAGuardar(false);
    }
  }

  async function confirmarApagar() {
    const b = apagar;
    setApagar(null);
    try {
      await api.delete(`/admin/bolsas/${b.id}`);
      setDados((d) => ({ ...d, bolsas: d.bolsas.filter((x) => x.id !== b.id) }));
      setMensagem({ tipo: 'sucesso', texto: `Bolsa «${b.nome}» apagada.` });
    } catch (e2) {
      setMensagem({ tipo: 'erro', texto: mensagemErro(e2) });
    }
  }

  if (aCarregar && !dados) return <Carregando />;
  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;
  if (!dados) return null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-slate-600">{dados.bolsas.length} bolsas, incluindo as encerradas.</p>
        <button type="button" className="btn-primario" onClick={abrirNova}>
          <Icone nome="mais" className="h-4 w-4" /> Nova bolsa
        </button>
      </div>

      {mensagem.texto && <Aviso tipo={mensagem.tipo}>{mensagem.texto}</Aviso>}

      <div className="cartao overflow-x-auto">
        <table className="tabela min-w-[760px]">
          <thead>
            <tr>
              <th>Bolsa</th>
              <th>País</th>
              <th>Tipo / nível</th>
              <th>Prazo</th>
              <th>Docs</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {dados.bolsas.map((b) => (
              <tr key={b.id}>
                <td>
                  <p className="font-semibold text-azul">
                    {b.nome} {b.destaque && <Icone nome="estrela" className="ml-1 inline h-4 w-4 text-dourado" titulo="Em destaque" />}
                  </p>
                  <p className="text-sm text-slate-500">{b.entidade}</p>
                </td>
                <td>{b.pais}</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    <Etiqueta cor={b.tipo === 'INTERNA' ? 'verde' : 'azul'}>{TIPOS[b.tipo]}</Etiqueta>
                    <Etiqueta cor="cinza">{NIVEIS[b.nivel]}</Etiqueta>
                  </div>
                </td>
                <td>
                  <p className="whitespace-nowrap">{formatarData(b.prazo)}</p>
                  <p className={`text-sm ${b.diasParaPrazo < 0 ? 'text-slate-400' : 'text-slate-500'}`}>
                    {b.diasParaPrazo < 0 ? 'Encerrada' : textoPrazo(b.diasParaPrazo)}
                  </p>
                </td>
                <td>{b.documentos.length}</td>
                <td>
                  <div className="flex justify-end gap-1">
                    <button type="button" className="btn-fantasma btn-sm" onClick={() => abrirEdicao(b)} aria-label={`Editar ${b.nome}`}>
                      <Icone nome="editar" className="h-4 w-4" /> Editar
                    </button>
                    <button type="button" className="btn btn-sm text-red-700 hover:bg-red-50" onClick={() => setApagar(b)} aria-label={`Apagar ${b.nome}`}>
                      <Icone nome="lixo" className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- Formulário de criar / editar */}
      <Modal aberto={!!form} titulo={form?.id ? 'Editar bolsa' : 'Nova bolsa'} onFechar={() => setForm(null)} largura="max-w-3xl">
        {form && (
          <form onSubmit={guardar} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="b-nome" className="rotulo">Nome *</label>
                <input id="b-nome" required className="campo" value={form.nome} onChange={mudar('nome')} />
              </div>
              <div>
                <label htmlFor="b-entidade" className="rotulo">Entidade</label>
                <input id="b-entidade" className="campo" value={form.entidade} onChange={mudar('entidade')} />
              </div>
              <div>
                <label htmlFor="b-pais" className="rotulo">País *</label>
                <input id="b-pais" required className="campo" value={form.pais} onChange={mudar('pais')} />
              </div>
              <div>
                <label htmlFor="b-tipo" className="rotulo">Tipo *</label>
                <select id="b-tipo" className="campo" value={form.tipo} onChange={mudar('tipo')}>
                  {Object.entries(TIPOS).map(([v, r]) => <option key={v} value={v}>{r}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="b-nivel" className="rotulo">Nível *</label>
                <select id="b-nivel" className="campo" value={form.nivel} onChange={mudar('nivel')}>
                  {Object.entries(NIVEIS).map(([v, r]) => <option key={v} value={v}>{r}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="b-area" className="rotulo">Área de estudo</label>
                <input id="b-area" className="campo" value={form.areaEstudo} onChange={mudar('areaEstudo')} placeholder="Ex.: Engenharia" />
              </div>
              <div>
                <label htmlFor="b-prazo" className="rotulo">Prazo *</label>
                <input id="b-prazo" type="date" required className="campo" value={form.prazo} onChange={mudar('prazo')} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="b-link" className="rotulo">Link oficial</label>
                <input id="b-link" type="url" className="campo" value={form.linkOficial} onChange={mudar('linkOficial')} placeholder="https://…" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="b-desc" className="rotulo">Descrição</label>
                <textarea id="b-desc" rows={3} className="campo" value={form.descricao} onChange={mudar('descricao')} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="b-req" className="rotulo">Requisitos</label>
                <textarea id="b-req" rows={4} className="campo" value={form.requisitos} onChange={mudar('requisitos')} />
                <p className="ajuda">Um requisito por linha.</p>
              </div>
            </div>

            {/* Documentos exigidos */}
            <fieldset>
              <legend className="rotulo">Documentos exigidos</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {dados.tipos.map((t) => (
                  <label
                    key={t.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-[15px] ${
                      form.documentosIds.includes(t.id) ? 'border-azul bg-claro' : 'border-slate-200 hover:bg-fundo'
                    }`}
                  >
                    <input type="checkbox" className="h-4 w-4 accent-azul" checked={form.documentosIds.includes(t.id)} onChange={() => alternarDocumento(t.id)} />
                    <span className="flex-1">{t.nome}</span>
                    <span className="text-sm text-slate-500">{t.tempoMedioDias} d</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="flex items-center gap-3 rounded-xl border border-dourado/40 bg-dourado-claro/50 px-4 py-3">
              <input type="checkbox" className="h-4 w-4 accent-dourado" checked={form.destaque} onChange={mudar('destaque')} />
              <span><strong className="text-azul">Bolsa em destaque</strong> <span className="text-slate-600">– aparece na Home</span></span>
            </label>

            <Aviso tipo="erro">{erroForm}</Aviso>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" className="btn-contorno" onClick={() => setForm(null)}>Cancelar</button>
              <button type="submit" className="btn-primario" disabled={aGuardar}>{aGuardar ? 'A guardar…' : 'Guardar bolsa'}</button>
            </div>
          </form>
        )}
      </Modal>

      {/* ---------- Confirmar apagar */}
      <Modal aberto={!!apagar} titulo="Apagar bolsa?" onFechar={() => setApagar(null)}>
        <p className="text-slate-700">
          Vais apagar a bolsa <strong>{apagar?.nome}</strong>. Não é possível apagar bolsas seguidas por estudantes
          ou ligadas a mentores e mentorias.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn-contorno" onClick={() => setApagar(null)}>Cancelar</button>
          <button type="button" className="btn bg-red-600 text-white hover:bg-red-700" onClick={confirmarApagar}>Apagar</button>
        </div>
      </Modal>
    </div>
  );
}
