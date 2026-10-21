package ao.ajsv.bolsas.dto;

import ao.ajsv.bolsas.model.Nivel;
import ao.ajsv.bolsas.model.TipoBolsa;

import java.time.LocalDate;
import java.util.List;

public record BolsaRequest(
        String nome, String entidade, String pais, TipoBolsa tipo, String areaEstudo, Nivel nivel,
        String descricao, String requisitos, LocalDate prazo, String linkOficial, boolean destaque,
        List<Long> documentosIds) {}
