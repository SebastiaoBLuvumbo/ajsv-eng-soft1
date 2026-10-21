package ao.ajsv.bolsas.dto;

import ao.ajsv.bolsas.model.TipoDocumento;

public record TipoDocumentoDTO(Long id, String nome, Integer tempoMedioDias, String descricao) {
    public static TipoDocumentoDTO from(TipoDocumento t) {
        return new TipoDocumentoDTO(t.getId(), t.getNome(), t.getTempoMedioDias(), t.getDescricao());
    }
}
