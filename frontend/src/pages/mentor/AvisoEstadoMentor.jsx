import Aviso from '../../components/Aviso.jsx';

/** Aviso sobre o estado do perfil de mentor (PENDENTE ou REJEITADO). */
export default function AvisoEstadoMentor({ estado }) {
  if (estado === 'PENDENTE') {
    return (
      <Aviso tipo="atencao" titulo="O teu perfil está a aguardar aprovação">
        A equipa AJSV está a verificar a prova da tua bolsa. Até lá, o teu perfil não aparece na lista de mentores.
      </Aviso>
    );
  }
  if (estado === 'REJEITADO') {
    return (
      <Aviso tipo="erro" titulo="O teu perfil não foi aprovado">
        Não foi possível verificar a prova da tua bolsa. Contacta a equipa AJSV para mais informações.
      </Aviso>
    );
  }
  return null;
}
