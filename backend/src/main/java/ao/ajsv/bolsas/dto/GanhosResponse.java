package ao.ajsv.bolsas.dto;

public record GanhosResponse(
        long totalGanho, long mentoriasConcluidas, long mentoriasPendentes, long mentoriasEmCurso,
        double avaliacaoMedia) {}
