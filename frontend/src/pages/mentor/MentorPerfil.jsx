import { useEffect, useState } from 'react';
import { api, mensagemErro } from '../../api.js';
import Aviso from '../../components/Aviso.jsx';
import Avatar from '../../components/Avatar.jsx';
import Carregando from '../../components/Carregando.jsx';
import Etiqueta from '../../components/Etiqueta.jsx';
import SeloVerificado from '../../components/SeloVerificado.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDados } from '../../hooks/useDados.js';
import { ESTADOS_MENTOR } from '../../utils/formatar.js';
import AvisoEstadoMentor from './AvisoEstadoMentor.jsx';

/** Perfil do mentor: descrição, preço, foto (URL), ano da bolsa e telefone. */
export default function MentorPerfil() {
  const { utilizador, atualizar } = useAuth();
  const mentorId = utilizador.mentorId;
  const { dados: perfil, setDados, erro, aCarregar } = useDados(
    () => api.get(`/mentor/${mentorId}/perfil`).then((r) => r.data),
    [mentorId]
  );
  const [form, setForm] = useState(null);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [aGuardar, setAGuardar] = useState(false);

  // Preenche o formulário quando o perfil chega
  useEffect(() => {
    if (perfil) {
      setForm({
        descricao: perfil.descricao ?? '',
        preco: perfil.preco ?? '',
        fotoUrl: perfil.fotoUrl ?? '',
        anoBolsa: perfil.anoBolsa ?? '',
        telefone: perfil.telefone ?? '',
      });
    }
  }, [perfil]);

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function guardar(e) {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });
    setAGuardar(true);
    try {
      const { data } = await api.put(`/mentor/${mentorId}/perfil`, {
        descricao: form.descricao.trim(),
        preco: form.preco === '' ? null : Math.round(Number(form.preco)),
        fotoUrl: form.fotoUrl.trim(),
        anoBolsa: form.anoBolsa === '' ? null : Number(form.anoBolsa),
        telefone: form.telefone.trim(),
      });
      setDados(data);
      atualizar({ telefone: data.telefone });
      setMensagem({ tipo: 'sucesso', texto: 'Perfil guardado.' });
    } catch (e2) {
      setMensagem({ tipo: 'erro', texto: mensagemErro(e2) });
    } finally {
      setAGuardar(false);
    }
  }

  if (aCarregar && !perfil) return <Carregando />;
  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;
  if (!perfil || !form) return null;

  const estado = ESTADOS_MENTOR[perfil.estado];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <form onSubmit={guardar} className="cartao space-y-5 p-6">
        <AvisoEstadoMentor estado={perfil.estado} />

        <div>
          <label htmlFor="descricao" className="rotulo">Como podes ajudar</label>
          <textarea id="descricao" rows={5} className="campo" value={form.descricao} onChange={mudar('descricao')} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="preco" className="rotulo">Preço da mentoria (Kz)</label>
            <input id="preco" type="number" min="1" step="1" className="campo" value={form.preco} onChange={mudar('preco')} />
          </div>
          <div>
            <label htmlFor="ano" className="rotulo">Ano da bolsa</label>
            <input id="ano" type="number" min="1990" max={new Date().getFullYear()} className="campo" value={form.anoBolsa} onChange={mudar('anoBolsa')} />
          </div>
          <div>
            <label htmlFor="telefone" className="rotulo">Telefone</label>
            <input id="telefone" type="tel" className="campo" value={form.telefone} onChange={mudar('telefone')} />
          </div>
          <div>
            <label htmlFor="foto" className="rotulo">Foto (URL)</label>
            <input id="foto" type="url" className="campo" value={form.fotoUrl} onChange={mudar('fotoUrl')} placeholder="https://…" />
            <p className="ajuda">Deixa vazio para mostrar as iniciais.</p>
          </div>
        </div>

        <Aviso tipo={mensagem.tipo || 'info'}>{mensagem.texto}</Aviso>

        <button type="submit" className="btn-primario" disabled={aGuardar}>{aGuardar ? 'A guardar…' : 'Guardar perfil'}</button>
      </form>

      {/* Pré-visualização do cartão público */}
      <aside className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pré-visualização</p>
        <div className="cartao p-5 text-center">
          <div className="flex justify-center">
            <Avatar nome={perfil.nome} fotoUrl={form.fotoUrl.trim() || null} tamanho="h-20 w-20 text-2xl" />
          </div>
          <p className="mt-3 font-titulo text-lg font-semibold text-azul">{perfil.nome}</p>
          <div className="mt-2 flex justify-center">
            {perfil.verificado ? <SeloVerificado /> : <Etiqueta cor={estado?.cor}>{estado?.rotulo}</Etiqueta>}
          </div>
          <p className="mt-3 text-sm text-slate-600">
            {perfil.bolsaGanhaNome ?? 'Bolsa não indicada'}{form.anoBolsa ? ` · ${form.anoBolsa}` : ''}
          </p>
          {perfil.provaBolsa && <p className="mt-3 break-words text-xs text-slate-400">Prova: {perfil.provaBolsa}</p>}
        </div>
      </aside>
    </div>
  );
}
