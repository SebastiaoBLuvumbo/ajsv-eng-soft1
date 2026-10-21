import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api, mensagemErro } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatarKz } from '../utils/formatar.js';
import Avatar from './Avatar.jsx';
import Aviso from './Aviso.jsx';
import Modal from './Modal.jsx';
import SeloVerificado from './SeloVerificado.jsx';

/**
 * Janela "Contratar mentoria".
 * - Sem sessão: pede para entrar (e volta a esta página depois do login).
 * - Perfil que não é estudante: explica que só estudantes podem contratar.
 * - Estudante: escreve a mensagem e chama POST /estudante/{id}/mentorias.
 */
export default function ModalContratar({ mentor, bolsaId, onFechar }) {
  const { utilizador } = useAuth();
  const local = useLocation();
  const [mensagem, setMensagem] = useState('');
  const [aEnviar, setAEnviar] = useState(false);
  const [erro, setErro] = useState('');
  const [enviado, setEnviado] = useState(false);

  // Limpa o formulário sempre que se abre para outro mentor
  useEffect(() => {
    setMensagem('');
    setErro('');
    setEnviado(false);
  }, [mentor?.id]);

  if (!mentor) return null;

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    if (mensagem.trim().length < 10) {
      setErro('Descreve em poucas palavras em que precisas de ajuda (pelo menos 10 caracteres).');
      return;
    }
    setAEnviar(true);
    try {
      await api.post(`/estudante/${utilizador.id}/mentorias`, {
        mentorId: mentor.id,
        bolsaId: bolsaId ?? mentor.bolsaGanhaId ?? null,
        mensagem: mensagem.trim(),
      });
      setEnviado(true);
    } catch (e2) {
      setErro(mensagemErro(e2));
    } finally {
      setAEnviar(false);
    }
  }

  const voltarPara = local.pathname + local.search;

  return (
    <Modal aberto={!!mentor} titulo="Contratar mentoria" onFechar={onFechar}>
      {/* Resumo do mentor */}
      <div className="flex items-center gap-3 rounded-xl bg-claro/70 p-3">
        <Avatar nome={mentor.nome} fotoUrl={mentor.fotoUrl} />
        <div className="min-w-0">
          <p className="font-semibold text-azul">{mentor.nome}</p>
          <p className="truncate text-sm text-slate-600">{mentor.bolsaGanhaNome}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="font-titulo font-semibold text-verde">{formatarKz(mentor.preco)}</p>
          {mentor.verificado && <SeloVerificado className="mt-1 hidden sm:inline-flex" />}
        </div>
      </div>

      <div className="mt-5">
        {!utilizador && (
          <div className="space-y-4">
            <Aviso tipo="info" titulo="Entra para contratar uma mentoria">
              Precisas de uma conta de estudante para enviar um pedido ao mentor.
            </Aviso>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link to="/entrar" state={{ voltarPara }} className="btn-primario flex-1">Entrar</Link>
              <Link to="/criar-conta" className="btn-contorno flex-1">Criar conta</Link>
            </div>
          </div>
        )}

        {utilizador && utilizador.perfil !== 'ESTUDANTE' && (
          <Aviso tipo="atencao" titulo="Só estudantes podem contratar mentorias">
            Entraste como {utilizador.perfil === 'MENTOR' ? 'mentor' : 'administrador'}. Para contratar, usa uma conta de estudante.
          </Aviso>
        )}

        {utilizador?.perfil === 'ESTUDANTE' && enviado && (
          <div className="space-y-4">
            <Aviso tipo="sucesso" titulo="Pedido enviado!">
              O mentor vai aceitar ou recusar o teu pedido. O valor só é cobrado depois de o mentor aceitar.
            </Aviso>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link to="/area/estudante/mentorias" className="btn-primario flex-1">Ver as minhas mentorias</Link>
              <button type="button" className="btn-contorno flex-1" onClick={onFechar}>Fechar</button>
            </div>
          </div>
        )}

        {utilizador?.perfil === 'ESTUDANTE' && !enviado && (
          <form onSubmit={enviar} className="space-y-4">
            <div>
              <label htmlFor="mensagem" className="rotulo">Mensagem para o mentor</label>
              <textarea
                id="mensagem"
                rows={5}
                className="campo"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Ex.: Preciso de ajuda com a carta de motivação e com a preparação para a entrevista."
              />
              <p className="ajuda">Diz em que precisas de ajuda: carta de motivação, CV, entrevista, documentos…</p>
            </div>

            <Aviso tipo="info">
              O valor de <strong>{formatarKz(mentor.preco)}</strong> só é cobrado depois de o mentor aceitar o pedido.
            </Aviso>
            <Aviso tipo="erro">{erro}</Aviso>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" className="btn-contorno" onClick={onFechar}>Cancelar</button>
              <button type="submit" className="btn-primario" disabled={aEnviar}>
                {aEnviar ? 'A enviar…' : 'Enviar pedido'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
