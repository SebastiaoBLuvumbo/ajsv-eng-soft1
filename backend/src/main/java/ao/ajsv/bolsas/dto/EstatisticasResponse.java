package ao.ajsv.bolsas.dto;

public record EstatisticasResponse(
        long totalBolsas, long totalEstudantes, long totalMentores, long mentoresPendentes,
        long totalMentorias, long mentoriasConcluidas, long valorMovimentado, long convitesEnviados) {}
