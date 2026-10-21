package ao.ajsv.bolsas.dto;

import ao.ajsv.bolsas.model.Bolsa;
import ao.ajsv.bolsas.model.BolsaDocumento;
import ao.ajsv.bolsas.model.Nivel;
import ao.ajsv.bolsas.model.TipoBolsa;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

public record BolsaResponse(
        Long id, String nome, String entidade, String pais, TipoBolsa tipo, String areaEstudo, Nivel nivel,
        String descricao, String requisitos, LocalDate prazo, long diasParaPrazo, String linkOficial,
        boolean destaque, List<TipoDocumentoDTO> documentos) {

    public static BolsaResponse from(Bolsa b, List<BolsaDocumento> docs) {
        List<TipoDocumentoDTO> documentos = docs.stream()
                .map(d -> TipoDocumentoDTO.from(d.getTipoDocumento()))
                .toList();
        return new BolsaResponse(b.getId(), b.getNome(), b.getEntidade(), b.getPais(), b.getTipo(),
                b.getAreaEstudo(), b.getNivel(), b.getDescricao(), b.getRequisitos(), b.getPrazo(),
                ChronoUnit.DAYS.between(LocalDate.now(), b.getPrazo()), b.getLinkOficial(),
                b.isDestaque(), documentos);
    }
}
