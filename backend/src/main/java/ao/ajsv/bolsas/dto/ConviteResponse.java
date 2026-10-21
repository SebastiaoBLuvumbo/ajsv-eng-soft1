package ao.ajsv.bolsas.dto;

import ao.ajsv.bolsas.model.ConviteMentor;
import ao.ajsv.bolsas.model.EstadoConvite;

import java.time.LocalDate;

public record ConviteResponse(
        Long id, Long estudanteId, String estudanteNome, Long bolsaId, String bolsaNome,
        LocalDate dataEnvio, EstadoConvite estado) {

    public static ConviteResponse from(ConviteMentor c) {
        return new ConviteResponse(c.getId(), c.getEstudante().getId(), c.getEstudante().getNome(),
                c.getBolsa().getId(), c.getBolsa().getNome(), c.getDataEnvio(), c.getEstado());
    }
}
