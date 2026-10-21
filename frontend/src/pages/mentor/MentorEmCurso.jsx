import Icone from '../../components/Icone.jsx';
import ListaMentoriasMentor from './ListaMentoriasMentor.jsx';

/** Mentorias aceites, com o contacto do estudante e "Marcar como concluída". */
export default function MentorEmCurso() {
  return (
    <ListaMentoriasMentor
      estado="ACEITE"
      mostrarContacto
      introducao="Entra em contacto com o estudante. Quando terminares, marca a mentoria como concluída para ele te poder avaliar."
      vazio={{ icone: 'mensagem', titulo: 'Sem mentorias em curso', texto: 'Os pedidos que aceitares aparecem aqui com o contacto do estudante.' }}
      acoes={(m, executar, aExecutar) => (
        <button type="button" className="btn-primario" disabled={aExecutar} onClick={() => executar(m, 'concluir')}>
          <Icone nome="check" className="h-4 w-4" /> {aExecutar ? 'A guardar…' : 'Marcar como concluída'}
        </button>
      )}
    />
  );
}
