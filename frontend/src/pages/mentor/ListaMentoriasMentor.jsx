import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api, mensagemErro } from '../../api.js';
import Aviso from '../../components/Aviso.jsx';
import Carregando from '../../components/Carregando.jsx';
import CartaoMentoria from '../../components/CartaoMentoria.jsx';
import EstadoVazio from '../../components/EstadoVazio.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDados } from '../../hooks/useDados.js';

/**
 * Lista das mentorias do mentor filtradas por estado (usada em Pedidos, Em curso e Histórico).
 * Atenção: as rotas /mentor/{id} usam o mentorId do utilizador, NÃO o id do utilizador.
 *
 * `acoes(mentoria, executar, aExecutar)` devolve os botões de cada cartão;
 * `executar(mentoria, 'aceitar' | 'recusar' | 'concluir')` chama PUT /mentor/{id}/mentorias/{mentoriaId}/{acao}.
 */
export default function ListaMentoriasMentor({ estado, introducao, vazio, mostrarContacto = false, acoes }) {
  const { utilizador } = useAuth();
  const mentorId = utilizador.mentorId;
  const { recarregarContadores } = useOutletContext();
  const [aExecutar, setAExecutar] = useState(null);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const { dados: mentorias, setDados, erro, aCarregar } = useDados(
    () => api.get(`/mentor/${mentorId}/mentorias`).then((r) => r.data),
    [mentorId]
  );

  async function executar(mentoria, acao) {
    setAExecutar(mentoria.id);
    setMensagem({ tipo: '', texto: '' });
    try {
      const { data } = await api.put(`/mentor/${mentorId}/mentorias/${mentoria.id}/${acao}`);
      setDados((lista) => lista.map((m) => (m.id === data.id ? data : m)));
      const textos = {
        aceitar: `Aceitaste o pedido de ${mentoria.estudanteNome}. Encontra o contacto em «Em curso».`,
        recusar: `Recusaste o pedido de ${mentoria.estudanteNome}.`,
        concluir: `Mentoria com ${mentoria.estudanteNome} marcada como concluída.`,
      };
      setMensagem({ tipo: 'sucesso', texto: textos[acao] });
      recarregarContadores();
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: mensagemErro(e) });
    } finally {
      setAExecutar(null);
    }
  }

  if (aCarregar && !mentorias) return <Carregando />;
  if (erro) return <Aviso tipo="erro">{erro}</Aviso>;

  const filtradas = (mentorias ?? []).filter((m) => m.estado === estado);

  return (
    <div className="space-y-5">
      {introducao && <p className="text-slate-600">{introducao}</p>}
      {mensagem.texto && <Aviso tipo={mensagem.tipo}>{mensagem.texto}</Aviso>}

      {filtradas.length === 0 ? (
        <EstadoVazio icone={vazio.icone} titulo={vazio.titulo}>{vazio.texto}</EstadoVazio>
      ) : (
        filtradas.map((m) => (
          <CartaoMentoria key={m.id} mentoria={m} vista="mentor" mostrarContacto={mostrarContacto}>
            {acoes?.(m, executar, aExecutar === m.id)}
          </CartaoMentoria>
        ))
      )}
    </div>
  );
}
