import ListaMentoriasMentor from './ListaMentoriasMentor.jsx';

/** Mentorias concluídas, com as avaliações dos estudantes. */
export default function MentorHistorico() {
  return (
    <ListaMentoriasMentor
      estado="CONCLUIDA"
      introducao="As mentorias que já terminaste e as avaliações que recebeste."
      vazio={{ icone: 'historico', titulo: 'Ainda sem mentorias concluídas', texto: 'Quando concluíres uma mentoria, ela aparece aqui com a avaliação do estudante.' }}
    />
  );
}
