package ao.ajsv.bolsas.dto;

import ao.ajsv.bolsas.model.DocumentoEstudante;
import ao.ajsv.bolsas.model.EstadoDocumento;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * alerta:
 *  - ATRASADO → a data limite já passou e o documento não está concluído
 *  - PROXIMO  → faltam 14 dias ou menos
 *  - OK       → está dentro do prazo ou já foi concluído
 */
public record DocumentoEstudanteResponse(
        Long id, Long tipoDocumentoId, String nome, Integer tempoMedioDias,
        EstadoDocumento estado, LocalDate dataLimite, long diasRestantes, String alerta) {

    public static final int DIAS_ALERTA = 14;

    public static DocumentoEstudanteResponse from(DocumentoEstudante d) {
        long dias = ChronoUnit.DAYS.between(LocalDate.now(), d.getDataLimite());
        String alerta;
        if (d.getEstado() == EstadoDocumento.CONCLUIDO) alerta = "OK";
        else if (dias < 0) alerta = "ATRASADO";
        else if (dias <= DIAS_ALERTA) alerta = "PROXIMO";
        else alerta = "OK";
        return new DocumentoEstudanteResponse(d.getId(), d.getTipoDocumento().getId(),
                d.getTipoDocumento().getNome(), d.getTipoDocumento().getTempoMedioDias(),
                d.getEstado(), d.getDataLimite(), dias, alerta);
    }
}
