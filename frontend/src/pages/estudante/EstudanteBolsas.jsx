import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, mensagemErro } from '../../api.js';
import Aviso from '../../components/Aviso.jsx';
import CalendarioBolsa from '../../components/CalendarioBolsa.jsx';
import Carregando from '../../components/Carregando.jsx';
import EstadoVazio from '../../components/EstadoVazio.jsx';
import Icone from '../../components/Icone.jsx';
import Modal from '../../components/Modal.jsx';
import ModalContratar from '../../components/ModalContratar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDados } from '../../hooks/useDados.js';

/**
 * "As minhas bolsas": o calendário de cada bolsa seguida.
 * Cada documento tem uma lista para mudar o estado; cada bolsa tem
 * "Ganhei esta bolsa" e "Deixar de seguir".
 */
export default function EstudanteBolsas() {
  const { utilizador } = useAuth();
  const id = utilizador.id;
  const { dados: calendarios, setDados, erro, aCarregar, recarregar } = useDados(
    () => api.get(`/estudante/${id}/bolsas`).then((r) => r.data),
    [id]
  );
  const [aMudar, setAMudar] = useState(null);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [confirmar, setConfirmar] = useState(null); // { acao: 'ganha' | 'deixar', calendario }
  const [aConfirmar, setAConfirmar] = useState(false);
  const [mentor, setMentor] = useState(null); // { mentor, bolsaId } para "Falar com o mentor"

  // Muda o estado de um documento e volta a carregar (o alerta e o progresso mudam)
  async function mudarEstado(doc, estado) {
    setAMudar(doc.id);
    setMensagem({ tipo: '', texto: '' });
    try {
      await api.put(`/estudante/${id}/documentos/${doc.id}/estado`, { estado });
      const { data } = await api.get(`/estudante/${id}/bolsas`);
      setDados(data);
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: mensagemErro(e) });
    } finally {
      setAMudar(null);
    }
  }

  async function executarConfirmacao() {
    const { acao, calendario } = confirmar;
    setAConfirmar(true);
    setMensagem({ tipo: '', texto: '' });
    try {
      if (acao === 'ganha') {
        const { data } = await api.post(`/estudante/${id}/bolsas/${calendario.bolsaId}/ganha`);
        setDados((lista) => lista.map((c) => (c.bolsaId === data.bolsaId ? data : c)));
        setMensagem({
          tipo: 'sucesso',
          texto: `Parabéns pela ${calendario.bolsaNome}! Se recebeste um convite para seres mentor, vais vê-lo no Início.`,
        });
      } else {
        await api.delete(`/estudante/${id}/bolsas/${calendario.bolsaId}/seguir`);
        setDados((lista) => lista.filter((c) => c.bolsaId !== calendario.bolsaId));
        setMensagem({ tipo: 'sucesso', texto: `Deixaste de seguir a ${calendario.bolsaNome}.` });
      }
      setConfirmar(null);
    } catch (e) {
      setConfirmar(null);
      setMensagem({ tipo: 'erro', texto: mensagemErro(e) });
    } finally {
      setAConfirmar(false);
    }
  }

  if (aCarregar && !calendarios) return <Carregando />;
  if (erro) {
    return (
      <div className="space-y-4">
        <Aviso tipo="erro">{erro}</Aviso>
        <button type="button" className="btn-contorno" onClick={recarregar}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-slate-600">Atualiza o estado de cada documento à medida que avanças.</p>
        <Link to="/bolsas" className="btn-contorno btn-sm">
          <Icone nome="mais" className="h-4 w-4" /> Seguir outra bolsa
        </Link>
      </div>

      {mensagem.texto && <Aviso tipo={mensagem.tipo}>{mensagem.texto}</Aviso>}

      {calendarios?.length === 0 && (
        <EstadoVazio icone="calendario" titulo="Ainda não segues nenhuma bolsa" acao={<Link to="/bolsas" className="btn-primario">Explorar bolsas</Link>}>
          Quando clicares em «Quero candidatar-me» numa bolsa, o calendário aparece aqui.
        </EstadoVazio>
      )}

      {calendarios?.map((c) => (
        <CalendarioBolsa
          key={c.bolsaId}
          calendario={c}
          editavel
          aMudar={aMudar}
          onMudarEstado={mudarEstado}
          onFalarMentor={(m, bolsaId) => setMentor({ mentor: m, bolsaId })}
          acoes={
            <>
              {!c.ganha && (
                <button type="button" className="btn-dourado btn-sm" onClick={() => setConfirmar({ acao: 'ganha', calendario: c })}>
                  <Icone nome="trofeu" className="h-4 w-4" /> Ganhei esta bolsa
                </button>
              )}
              <button type="button" className="btn-perigo btn-sm" onClick={() => setConfirmar({ acao: 'deixar', calendario: c })}>
                Deixar de seguir
              </button>
            </>
          }
        />
      ))}

      {/* Confirmação das ações */}
      <Modal
        aberto={!!confirmar}
        titulo={confirmar?.acao === 'ganha' ? 'Ganhaste esta bolsa?' : 'Deixar de seguir?'}
        onFechar={() => setConfirmar(null)}
      >
        <p className="text-slate-700">
          {confirmar?.acao === 'ganha'
            ? <>Vamos marcar a <strong>{confirmar?.calendario.bolsaNome}</strong> como ganha. Depois podes receber um convite para seres mentor.</>
            : <>Vais deixar de seguir a <strong>{confirmar?.calendario.bolsaNome}</strong> e o calendário desta bolsa é apagado.</>}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn-contorno" onClick={() => setConfirmar(null)}>Cancelar</button>
          <button
            type="button"
            className={confirmar?.acao === 'ganha' ? 'btn-dourado' : 'btn bg-red-600 text-white hover:bg-red-700'}
            onClick={executarConfirmacao}
            disabled={aConfirmar}
          >
            {aConfirmar ? 'A guardar…' : confirmar?.acao === 'ganha' ? 'Sim, ganhei!' : 'Deixar de seguir'}
          </button>
        </div>
      </Modal>

      <ModalContratar mentor={mentor?.mentor} bolsaId={mentor?.bolsaId} onFechar={() => setMentor(null)} />
    </div>
  );
}
