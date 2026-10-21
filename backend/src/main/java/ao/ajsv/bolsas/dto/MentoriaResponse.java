package ao.ajsv.bolsas.dto;

import ao.ajsv.bolsas.model.Avaliacao;
import ao.ajsv.bolsas.model.EstadoMentoria;
import ao.ajsv.bolsas.model.Mentoria;

import java.time.LocalDate;

public record MentoriaResponse(
        Long id, Long estudanteId, String estudanteNome, String estudanteEmail, String estudanteTelefone,
        Long mentorId, String mentorNome, Long bolsaId, String bolsaNome, Long valor,
        EstadoMentoria estado, LocalDate dataPedido, String mensagem, Integer nota, String comentario) {

    public static MentoriaResponse from(Mentoria m, Avaliacao a) {
        return new MentoriaResponse(m.getId(), m.getEstudante().getId(), m.getEstudante().getNome(),
                m.getEstudante().getEmail(), m.getEstudante().getTelefone(),
                m.getMentor().getId(), m.getMentor().getUtilizador().getNome(),
                m.getBolsa() != null ? m.getBolsa().getId() : null,
                m.getBolsa() != null ? m.getBolsa().getNome() : null,
                m.getValor(), m.getEstado(), m.getDataPedido(), m.getMensagem(),
                a != null ? a.getNota() : null, a != null ? a.getComentario() : null);
    }
}
