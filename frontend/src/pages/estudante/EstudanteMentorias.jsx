import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, mensagemErro } from '../../api.js';
import Aviso from '../../components/Aviso.jsx';
import Carregando from '../../components/Carregando.jsx';
import CartaoMentoria from '../../components/CartaoMentoria.jsx';
import EstadoVazio from '../../components/EstadoVazio.jsx';
import Estrelas from '../../components/Estrelas.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDados } from '../../hooks/useDados.js';

/** Mentorias do estudante: estado de cada uma e avaliação das concluídas. */
export default function EstudanteMentorias() {
  const { utilizador } = useAuth();
  const id = utilizador.id;
  const { dados: mentorias, setDados, erro, aCarregar } = useDados(
    () => api.get(`/estudante/${id}/mentorias`).then((r) => r.data),
    [id]
  );

  if (aCarregar && !mentorias) return <Carregando />;
  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;

  // Substitui a mentoria avaliada na lista
  const aoAvaliar = (atualizada) => setDados((lista) => lista.map((m) => (m.id === atualizada.id ? atualizada : m)));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-slate-600">O valor só é cobrado depois de o mentor aceitar o pedido.</p>
        <Link to="/mentores" className="btn-contorno btn-sm">Encontrar mentores</Link>
      </div>

      {mentorias?.length === 0 && (
        <EstadoVazio icone="mentoria" titulo="Ainda não pediste nenhuma mentoria" acao={<Link to="/mentores" className="btn-primario">Ver mentores</Link>}>
          Um mentor que já ganhou a bolsa pode ajudar-te com a carta de motivação, o CV e a entrevista.
        </EstadoVazio>
      )}

      {mentorias?.map((m) => (
        <CartaoMentoria key={m.id} mentoria={m} vista="estudante">
          {m.estado === 'PENDENTE' && <p className="text-sm text-slate-500">À espera da resposta do mentor.</p>}
          {m.estado === 'ACEITE' && <p className="text-sm text-slate-500">O mentor aceitou e vai entrar em contacto contigo.</p>}
          {m.estado === 'CONCLUIDA' && !m.nota && <FormAvaliacao estudanteId={id} mentoria={m} onAvaliado={aoAvaliar} />}
        </CartaoMentoria>
      ))}
    </div>
  );
}

/** Avaliação de 1 a 5 estrelas de uma mentoria concluída. */
function FormAvaliacao({ estudanteId, mentoria, onAvaliado }) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [erro, setErro] = useState('');
  const [aEnviar, setAEnviar] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    if (!nota) return setErro('Escolhe de 1 a 5 estrelas.');
    setErro('');
    setAEnviar(true);
    try {
      const { data } = await api.post(`/estudante/${estudanteId}/mentorias/${mentoria.id}/avaliar`, { nota, comentario: comentario.trim() });
      onAvaliado(data);
    } catch (e2) {
      setErro(mensagemErro(e2));
      setAEnviar(false);
    }
  }

  return (
    <form onSubmit={enviar} className="w-full rounded-xl border border-dourado/40 bg-dourado-claro/50 p-4">
      <p className="font-semibold text-azul">Como correu a mentoria com {mentoria.mentorNome}?</p>
      <div className="mt-2">
        <Estrelas valor={nota} onEscolher={setNota} tamanho="h-8 w-8" />
      </div>
      <label htmlFor={`coment-${mentoria.id}`} className="rotulo mt-3">Comentário (opcional)</label>
      <textarea id={`coment-${mentoria.id}`} rows={2} className="campo" value={comentario} onChange={(e) => setComentario(e.target.value)} />
      <Aviso tipo="erro" className="mt-3">{erro}</Aviso>
      <button type="submit" className="btn-primario btn-sm mt-3" disabled={aEnviar}>
        {aEnviar ? 'A enviar…' : 'Enviar avaliação'}
      </button>
    </form>
  );
}
