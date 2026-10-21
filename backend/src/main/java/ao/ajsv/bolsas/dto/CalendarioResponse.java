package ao.ajsv.bolsas.dto;

import java.time.LocalDate;
import java.util.List;

/** Uma bolsa seguida pelo estudante, com o calendário de documentos e mentores sugeridos (quando há alertas). */
public record CalendarioResponse(
        Long bolsaId, String bolsaNome, String pais, LocalDate prazo, long diasParaPrazo, boolean ganha,
        List<DocumentoEstudanteResponse> documentos, int concluidos, boolean temAlerta,
        List<MentorResponse> mentoresSugeridos) {}
