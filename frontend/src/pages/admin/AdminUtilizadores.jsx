import { useState } from 'react';
import { api, mensagemErro } from '../../api.js';
import Avatar from '../../components/Avatar.jsx';
import Aviso from '../../components/Aviso.jsx';
import Carregando from '../../components/Carregando.jsx';
import Etiqueta from '../../components/Etiqueta.jsx';
import { useDados } from '../../hooks/useDados.js';
import { ESTADOS_MENTOR, PERFIS, formatarData } from '../../utils/formatar.js';

const COR_PERFIL = { ESTUDANTE: 'azul', MENTOR: 'verde', SUPERADMIN: 'dourado' };

/** Utilizadores: tabela com filtro por perfil e botão ativar/desativar (exceto SuperAdmin). */
export default function AdminUtilizadores() {
  const { dados: utilizadores, setDados, erro, aCarregar } = useDados(() => api.get('/admin/utilizadores').then((r) => r.data));
  const [perfil, setPerfil] = useState('');
  const [aMudar, setAMudar] = useState(null);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  async function alternar(u) {
    setAMudar(u.id);
    setMensagem({ tipo: '', texto: '' });
    try {
      const { data } = await api.put(`/admin/utilizadores/${u.id}/ativo`, { ativo: !u.ativo });
      setDados((lista) => lista.map((x) => (x.id === data.id ? data : x)));
      setMensagem({ tipo: 'sucesso', texto: `A conta de ${u.nome} foi ${data.ativo ? 'ativada' : 'desativada'}.` });
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: mensagemErro(e) });
    } finally {
      setAMudar(null);
    }
  }

  if (aCarregar && !utilizadores) return <Carregando />;
  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;
  if (!utilizadores) return null;

  const lista = utilizadores.filter((u) => !perfil || u.perfil === perfil);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="w-full sm:w-60">
          <label htmlFor="f-perfil" className="rotulo">Perfil</label>
          <select id="f-perfil" className="campo" value={perfil} onChange={(e) => setPerfil(e.target.value)}>
            <option value="">Todos</option>
            {Object.entries(PERFIS).map(([v, r]) => <option key={v} value={v}>{r}</option>)}
          </select>
        </div>
        <p className="text-slate-600">{lista.length} {lista.length === 1 ? 'utilizador' : 'utilizadores'}</p>
      </div>

      {mensagem.texto && <Aviso tipo={mensagem.tipo}>{mensagem.texto}</Aviso>}

      <div className="cartao overflow-x-auto">
        <table className="tabela min-w-[760px]">
          <thead>
            <tr>
              <th>Utilizador</th>
              <th>Telefone</th>
              <th>Perfil</th>
              <th>Registo</th>
              <th>Estado</th>
              <th className="text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((u) => (
              <tr key={u.id} className={u.ativo ? '' : 'opacity-60'}>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar nome={u.nome} tamanho="h-9 w-9 text-xs" />
                    <div className="min-w-0">
                      <p className="font-semibold text-azul">{u.nome}</p>
                      <p className="text-sm text-slate-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap">{u.telefone || '—'}</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    <Etiqueta cor={COR_PERFIL[u.perfil]}>{PERFIS[u.perfil]}</Etiqueta>
                    {u.estadoMentor && u.perfil !== 'MENTOR' && <Etiqueta cor="verde">Mentor</Etiqueta>}
                    {u.estadoMentor === 'PENDENTE' && <Etiqueta cor="laranja">{ESTADOS_MENTOR.PENDENTE.rotulo}</Etiqueta>}
                  </div>
                </td>
                <td className="whitespace-nowrap">{formatarData(u.dataRegisto)}</td>
                <td>{u.ativo ? <Etiqueta cor="verde">Ativo</Etiqueta> : <Etiqueta cor="cinza">Inativo</Etiqueta>}</td>
                <td className="text-right">
                  {u.perfil === 'SUPERADMIN' ? (
                    <span className="text-sm text-slate-400">—</span>
                  ) : (
                    <button
                      type="button"
                      className={u.ativo ? 'btn-perigo btn-sm' : 'btn-secundario btn-sm'}
                      disabled={aMudar === u.id}
                      onClick={() => alternar(u)}
                    >
                      {u.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
