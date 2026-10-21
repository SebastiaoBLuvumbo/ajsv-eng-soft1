import Icone from '../../components/Icone.jsx';
import ListaMentoriasMentor from './ListaMentoriasMentor.jsx';

/** Pedidos de mentoria por responder (estado PENDENTE). */
export default function MentorPedidos() {
  return (
    <ListaMentoriasMentor
      estado="PENDENTE"
      introducao="Lê a mensagem de cada estudante e decide. O valor só é cobrado ao estudante depois de aceitares."
      vazio={{ icone: 'caixa', titulo: 'Sem pedidos por responder', texto: 'Quando um estudante te contratar, o pedido aparece aqui.' }}
      acoes={(m, executar, aExecutar) => (
        <>
          <button type="button" className="btn-secundario" disabled={aExecutar} onClick={() => executar(m, 'aceitar')}>
            <Icone nome="check" className="h-4 w-4" /> Aceitar
          </button>
          <button type="button" className="btn-perigo" disabled={aExecutar} onClick={() => executar(m, 'recusar')}>
            <Icone nome="fechar" className="h-4 w-4" /> Recusar
          </button>
        </>
      )}
    />
  );
}
